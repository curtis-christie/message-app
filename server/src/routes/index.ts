import { Router } from "express";
import { healthRoutes } from "./health.routes.js";
import { authRoutes } from "./auth.routes.js";
import { userRoutes } from "./user.routes.js";
import { messageRequestRoutes } from "./message-request.routes.js";
import { conversationRoutes } from "./conversation.routes.js";

export const apiRoutes = Router();

apiRoutes.use("/health", healthRoutes);
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/users", userRoutes);
apiRoutes.use("/message-requests", messageRequestRoutes);
apiRoutes.use("/conversations", conversationRoutes);
