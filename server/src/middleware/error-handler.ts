import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/http-error.js";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(error);

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
  }

  return res.status(500).json({
    error: {
      message: "Internal Server Error.",
    },
  });
}
