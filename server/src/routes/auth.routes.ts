import { Router } from "express";

import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { toSafeUser } from "../utils/user-response.js";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, password, bio, avatarInitials } = req.body as {
      username?: string;
      password?: string;
      bio?: string;
      avatarInitials?: string;
    };

    const normalizedUsername = username?.trim().toLowerCase();
    const normalizedBio = bio?.trim() || null;
    const normalizedAvatarInitials = avatarInitials?.trim().toUpperCase();

    if (!normalizedUsername || normalizedUsername.length < 3) {
      throw new HttpError(400, "Username must be at least 3 characters.");
    }

    if (!password || password.length < 8) {
      throw new HttpError(400, "Password must be at least 8 characters.");
    }

    if (!normalizedAvatarInitials || normalizedAvatarInitials.length > 3) {
      throw new HttpError(400, "Avatar initials are required and must be 3 characters or fewer.");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username: normalizedUsername,
      },
    });

    if (existingUser) {
      throw new HttpError(409, "Username is already taken.");
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: normalizedUsername,
        passwordHash,
        bio: normalizedBio,
        avatarInitials: normalizedAvatarInitials,
      },
    });

    req.session.userId = user.id;

    res.status(201).json({
      user: toSafeUser(user),
    });
  }),
);

authRoutes.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };

    const normalizedUsername = username?.trim().toLowerCase();

    if (!normalizedUsername || !password) {
      throw new HttpError(400, "Username and password are required.");
    }

    const user = await prisma.user.findUnique({
      where: {
        username: normalizedUsername,
      },
    });

    if (!user) {
      throw new HttpError(401, "Invalid username or password.");
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new HttpError(401, "Invalid username or password.");
    }

    req.session.userId = user.id;

    res.status(200).json({
      user: toSafeUser(user),
    });
  }),
);

authRoutes.post("/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }

    res.clearCookie("messaging_app.sid");

    res.status(200).json({
      message: "Logged out successfully.",
    });
  });
});

authRoutes.get(
  "/me",
  asyncHandler(async (req, res) => {
    if (!req.session.userId) {
      throw new HttpError(401, "Not authenticated.");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });

    if (!user) {
      req.session.destroy(() => {});
      throw new HttpError(401, "Not authenticated.");
    }

    res.status(200).json({
      user: toSafeUser(user),
    });
  }),
);
