import type { NextFunction, Request, Response } from "express";

import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/http-error.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.session.userId;

    if (!userId) {
      throw new HttpError(401, "You must be logged in.");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      req.session.destroy(() => {});
      throw new HttpError(401, "Your session is no longer valid.");
    }

    res.locals.user = user;

    next();
  } catch (error) {
    next(error);
  }
}
