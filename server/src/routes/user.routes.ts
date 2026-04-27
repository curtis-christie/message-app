import { Router } from "express";

import { requireAuth } from "../middleware/require-auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";
import { toSafeUser } from "../utils/user-response.js";
import {
  isNonEmptyString,
  isValidAvatarInitials,
  isValidBio,
  isValidUsername,
} from "../utils/validation.js";
import { prisma } from "../lib/prisma.js";

export const userRoutes = Router();

userRoutes.use(requireAuth);

/***************************************
 * GET /api/users/search?username=
 ***************************************/

userRoutes.get(
  "/search",
  asyncHandler(async (req, res) => {
    const username = req.query.username;

    if (!isNonEmptyString(username)) {
      throw new HttpError(400, "Username search query is required.");
    }

    const currentUser = res.locals.user;
    const searchTerm = username.trim();

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUser.id,
        },
        username: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      orderBy: {
        username: "asc",
      },
      take: 10,
    });

    res.json({
      users: users.map(toSafeUser),
    });
  }),
);

/***************************************
 * PATCH /api/users/me
 ***************************************/

userRoutes.patch(
  "/me",
  asyncHandler(async (req, res) => {
    const currentUser = res.locals.user;

    const { username, bio, avatarInitials } = req.body as {
      username?: unknown;
      bio?: unknown;
      avatarInitials?: unknown;
    };

    if (username !== undefined && !isValidUsername(username)) {
      throw new HttpError(
        400,
        "Username must be 3-30 characters and can only contain letters, numbers, and underscores.",
      );
    }

    if (!isValidBio(bio)) {
      throw new HttpError(400, "Bio must be 250 characters or fewer.");
    }

    if (avatarInitials !== undefined && !isValidAvatarInitials(avatarInitials)) {
      throw new HttpError(400, "Avatar initials must contain 1-3 letters.");
    }

    const updateData: {
      username?: string;
      bio?: string | null;
      avatarInitials?: string;
    } = {};

    if (typeof username === "string") {
      updateData.username = username.trim();
    }

    if (bio === null) {
      updateData.bio = null;
    }

    if (typeof bio === "string") {
      updateData.bio = bio.trim() || null;
    }

    if (typeof avatarInitials === "string") {
      updateData.avatarInitials = avatarInitials.trim().toUpperCase();
    }

    if (Object.keys(updateData).length === 0) {
      throw new HttpError(400, "No valid profile fields were provided.");
    }

    if (
      updateData.username &&
      updateData.username.toLowerCase() !== currentUser.username.toLowerCase()
    ) {
      const existingUser = await prisma.user.findUnique({
        where: {
          username: updateData.username,
        },
      });

      if (existingUser) {
        throw new HttpError(409, "Username is already taken.");
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: updateData,
    });

    res.json({
      user: toSafeUser(updatedUser),
    });
  }),
);

/***************************************
 * GET /api/users/:userId
 ***************************************/

userRoutes.get(
  "/:userId",
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId as string,
      },
    });

    if (!user) {
      throw new HttpError(404, "User not found.");
    }

    res.json({
      user: toSafeUser(user),
    });
  }),
);
