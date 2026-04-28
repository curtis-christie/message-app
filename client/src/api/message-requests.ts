import { apiRequest } from "./http";
import type { Conversation, MessageRequest } from "../types/message-request";

type MessageRequestResponse = {
  messageRequest: MessageRequest;
};

type MessageRequestsResponse = {
  messageRequests: MessageRequest[];
};

type AcceptMessageRequestResponse = {
  messageRequest: MessageRequest;
  conversation: Conversation;
};

export function sendMessageRequest(receiverId: string) {
  return apiRequest<MessageRequestResponse>("/message-requests", {
    method: "POST",
    body: JSON.stringify({ receiverId }),
  });
}

export function getIncomingMessageRequests() {
  return apiRequest<MessageRequestsResponse>("/message-requests/incoming");
}

export function getOutgoingMessageRequests() {
  return apiRequest<MessageRequestsResponse>("/message-requests/outgoing");
}

export function acceptMessageRequest(requestId: string) {
  return apiRequest<AcceptMessageRequestResponse>(`/message-requests/${requestId}/accept`, {
    method: "PATCH",
  });
}

export function declineMessageRequest(requestId: string) {
  return apiRequest<MessageRequestResponse>(`/message-requests/${requestId}/decline`, {
    method: "PATCH",
  });
}
