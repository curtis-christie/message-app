import type { User } from "./user";

export type ConversationParticipant = {
  id: string;
  conversationId: string;
  userId: string;
  createdAt: string;
  user: User;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  sender: User;
};

export type Conversation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  participants: ConversationParticipant[];
  messages: Message[];
};
