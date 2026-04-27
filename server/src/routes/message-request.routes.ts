import { MessageRequestStatus } from "@prisma/client";
import { Router } from "express";

import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/require-auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";
import { isNonEmptyString } from "../utils/validation.js";

export const messageRequestRoutes = Router();

messageRequestRoutes.use(requireAuth);

/***************************************
 * Helpers
 ***************************************/

function toMessageRequestResponse(request: {
  id: string;
  senderId: string;
  receiverId: string;
  status: MessageRequestStatus;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    username: string;
    bio: string | null;
    avatarInitials: string;
    createdAt: Date;
    updatedAt: Date;
  };
  receiver: {
    id: string;
    username: string;
    bio: string | null;
    avatarInitials: string;
    createdAt: Date;
    updatedAt: Date;
  };
}) {
  return {
    id: request.id,
    senderId: request.senderId,
    receiverId: request.receiverId,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    sender: request.sender,
    receiver: request.receiver,
  };
}

/***************************************
 * POST /api/message-requests
 ***************************************/

messageRequestRoutes.post(
  "/",
  asyncHandler(async (req, res) => {
    const currentUser = res.locals.user;

    const { receiverId } = req.body as {
      receiverId?: unknown;
    };

    if (!isNonEmptyString(receiverId)) {
      throw new HttpError(400, "Receiver id is required.");
    }

    if (receiverId === currentUser.id) {
      throw new HttpError(400, "You cannot send a message request to yourself.");
    }

    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
    });

    if (!receiver) {
      throw new HttpError(404, "Receiver not found.");
    }

    const existingRequest = await prisma.messageRequest.findFirst({
      where: {
        OR: [
          {
            senderId: currentUser.id,
            receiverId,
          },
          {
            senderId: receiverId,
            receiverId: currentUser.id,
          },
        ],
      },
    });

    if (existingRequest) {
      throw new HttpError(409, "A message request already exists between these users.");
    }

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                userId: currentUser.id,
              },
            },
          },
          {
            participants: {
              some: {
                userId: receiverId,
              },
            },
          },
        ],
      },
    });

    if (existingConversation) {
      throw new HttpError(409, "A conversation already exists between these users.");
    }

    const messageRequest = await prisma.messageRequest.create({
      data: {
        senderId: currentUser.id,
        receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            bio: true,
            avatarInitials: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            bio: true,
            avatarInitials: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    res.status(201).json({
      messageRequest: toMessageRequestResponse(messageRequest),
    });
  }),
);

/***************************************
 * GET /api/message-requests/incoming
 ***************************************/

messageRequestRoutes.get(
  "/incoming",
  asyncHandler(async (_req, res) => {
    const currentUser = res.locals.user;

    const messageRequests = await prisma.messageRequest.findMany({
      where: {
        receiverId: currentUser.id,
        status: MessageRequestStatus.PENDING,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            bio: true,
            avatarInitials: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            bio: true,
            avatarInitials: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      messageRequests: messageRequests.map(toMessageRequestResponse),
    });
  }),
);

/***************************************
 * GET /api/message-requests/outgoing
 ***************************************/

messageRequestRoutes.get(
  "/outgoing",
  asyncHandler(async (_req, res) => {
    const currentUser = res.locals.user;

    const messageRequests = await prisma.messageRequest.findMany({
      where: {
        senderId: currentUser.id,
        status: MessageRequestStatus.PENDING,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            bio: true,
            avatarInitials: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            bio: true,
            avatarInitials: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      messageRequests: messageRequests.map(toMessageRequestResponse),
    });
  }),
);

/***************************************
 * PATCH /api/message-requests/:requestId/accept
 ***************************************/

messageRequestRoutes.patch(
  "/:requestId/accept",
  asyncHandler(async (req, res) => {
    const currentUser = res.locals.user;
    const { requestId } = req.params;

    const messageRequest = await prisma.messageRequest.findUnique({
      where: {
        id: requestId as string,
      },
    });

    if (!messageRequest) {
      throw new HttpError(404, "Message request not found.");
    }

    if (messageRequest.receiverId !== currentUser.id) {
      throw new HttpError(403, "You are not allowed to accept this request.");
    }

    if (messageRequest.status !== MessageRequestStatus.PENDING) {
      throw new HttpError(400, "Only pending requests can be accepted.");
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.messageRequest.update({
        where: {
          id: requestId as string,
        },
        data: {
          status: MessageRequestStatus.ACCEPTED,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              bio: true,
              avatarInitials: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          receiver: {
            select: {
              id: true,
              username: true,
              bio: true,
              avatarInitials: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      const conversation = await tx.conversation.create({
        data: {
          participants: {
            create: [
              {
                userId: messageRequest.senderId,
              },
              {
                userId: messageRequest.receiverId,
              },
            ],
          },
        },
        include: {
          participants: true,
        },
      });

      return {
        messageRequest: updatedRequest,
        conversation,
      };
    });

    res.json({
      messageRequest: toMessageRequestResponse(result.messageRequest),
      conversation: result.conversation,
    });
  }),
);

/***************************************
 * PATCH /api/message-requests/:requestId/decline
 ***************************************/

messageRequestRoutes.patch(
  "/:requestId/decline",
  asyncHandler(async (req, res) => {
    const currentUser = res.locals.user;
    const { requestId } = req.params;

    const messageRequest = await prisma.messageRequest.findUnique({
      where: {
        id: requestId as string,
      },
    });

    if (!messageRequest) {
      throw new HttpError(404, "Message request not found.");
    }

    if (messageRequest.receiverId !== currentUser.id) {
      throw new HttpError(403, "You are not allowed to decline this request.");
    }

    if (messageRequest.status !== MessageRequestStatus.PENDING) {
      throw new HttpError(400, "Only pending requests can be declined.");
    }

    const declinedRequest = await prisma.messageRequest.update({
      where: {
        id: requestId as string,
      },
      data: {
        status: MessageRequestStatus.DECLINED,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            bio: true,
            avatarInitials: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            bio: true,
            avatarInitials: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    res.json({
      messageRequest: toMessageRequestResponse(declinedRequest),
    });
  }),
);
