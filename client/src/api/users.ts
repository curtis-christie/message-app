import { apiRequest } from "./http";
import type { User } from "../types/user";

type UserResponse = {
  user: User;
};

type UsersResponse = {
  users: User[];
};

export type UpdateProfileInput = {
  username?: string;
  bio?: string | null;
  avatarInitials?: string;
};

export function searchUsers(username: string) {
  const searchParams = new URLSearchParams({
    username,
  });

  return apiRequest<UsersResponse>(`/users/search?${searchParams.toString()}`);
}

export function getUserById(userId: string) {
  return apiRequest<UserResponse>(`/users/${userId}`);
}

export function updateMyProfile(input: UpdateProfileInput) {
  return apiRequest<UserResponse>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
