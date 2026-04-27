import { apiRequest } from "./http";
import type { User } from "../types/user";

type AuthResponse = {
  user: User;
};

type MessageResponse = {
  message: string;
};

export type RegisterInput = {
  username: string;
  password: string;
  bio?: string;
  avatarInitials: string;
};

export type LoginInput = {
  username: string;
  password: string;
};

export function registerUser(input: RegisterInput) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function loginUser(input: LoginInput) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logoutUser() {
  return apiRequest<MessageResponse>("/auth/logout", {
    method: "POST",
  });
}

export function getCurrentUser() {
  return apiRequest<AuthResponse>("/auth/me");
}
