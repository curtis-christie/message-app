import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import { apiRoutes } from "./routes/index.js";
import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

/* =========================================================
  Global Middleware
   ========================================================= */

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());

/* =========================================================
  Routes
   ========================================================= */

app.use("/api", apiRoutes);

/* =========================================================
  Error Handling
   ========================================================= */

app.use(notFound);
app.use(errorHandler);
