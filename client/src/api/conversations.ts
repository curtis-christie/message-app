import { apiRequest } from "./http";
import type { Conversation, Message } from "../types/conversation";

type ConversationsResponse = {
  conversations: Conversation[];
};

type ConversationResponse = {
  conversation: Conversation;
};

type MessageResponse = {
  message: Message;
};

export function getConversations() {
  return apiRequest<ConversationsResponse>("/conversations");
}

export function getConversationById(conversationId: string) {
  return apiRequest<ConversationResponse>(`/conversations/${conversationId}`);
}

export function sendMessage({ conversationId, body }: { conversationId: string; body: string }) {
  return apiRequest<MessageResponse>(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}
