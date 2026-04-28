import { Router } from "express";

import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/require-auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";
import { isNonEmptyString } from "../utils/validation.js";

export const conversationRoutes = Router();

conversationRoutes.use(requireAuth);

/***************************************
 * Shared Prisma selects/includes
 ***************************************/

const publicUserSelect = {
  id: true,
  username: true,
  bio: true,
  avatarInitials: true,
  createdAt: true,
  updatedAt: true,
};

const conversationInclude = {
  participants: {
    include: {
      user: {
        select: publicUserSelect,
      },
    },
  },
  messages: {
    include: {
      sender: {
        select: publicUserSelect,
      },
    },
    orderBy: {
      createdAt: "asc" as const,
    },
  },
};

/***************************************
 * GET /api/conversations
 ***************************************/

conversationRoutes.get(
  "/",
  asyncHandler(async (_req, res) => {
    const currentUser = res.locals.user;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: currentUser.id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: publicUserSelect,
            },
          },
        },
        messages: {
          include: {
            sender: {
              select: publicUserSelect,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.json({
      conversations,
    });
  }),
);

/***************************************
 * GET /api/conversations/:conversationId
 ***************************************/

conversationRoutes.get(
  "/:conversationId",
  asyncHandler(async (req, res) => {
    const currentUser = res.locals.user;
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId as string,
        participants: {
          some: {
            userId: currentUser.id,
          },
        },
      },
      include: conversationInclude,
    });

    if (!conversation) {
      throw new HttpError(404, "Conversation not found.");
    }

    res.json({
      conversation,
    });
  }),
);

/***************************************
 * POST /api/conversations/:conversationId/messages
 ***************************************/

conversationRoutes.post(
  "/:conversationId/messages",
  asyncHandler(async (req, res) => {
    const currentUser = res.locals.user;
    const { conversationId } = req.params;

    const { body } = req.body as {
      body?: unknown;
    };

    if (!isNonEmptyString(body)) {
      throw new HttpError(400, "Message body is required.");
    }

    const trimmedBody = body.trim();

    if (trimmedBody.length > 2000) {
      throw new HttpError(400, "Message body must be 2000 characters or fewer.");
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId as string,
        participants: {
          some: {
            userId: currentUser.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!conversation) {
      throw new HttpError(404, "Conversation not found.");
    }

    const message = await prisma.$transaction(async (tx) => {
      const createdMessage = await tx.message.create({
        data: {
          conversationId: conversationId as string,
          senderId: currentUser.id,
          body: trimmedBody,
        },
        include: {
          sender: {
            select: publicUserSelect,
          },
        },
      });

      await tx.conversation.update({
        where: {
          id: conversationId as string,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      return createdMessage;
    });

    res.status(201).json({
      message,
    });
  }),
);
