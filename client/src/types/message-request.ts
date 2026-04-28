import type { User } from "./user";

export type MessageRequestStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export type MessageRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: MessageRequestStatus;
  createdAt: string;
  updatedAt: string;
  sender: User;
  receiver: User;
};

export type ConversationParticipant = {
  id: string;
  conversationId: string;
  userId: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  participants: ConversationParticipant[];
};
