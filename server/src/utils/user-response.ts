import type { User } from "@prisma/client";

export function toSafeUser(user: User) {
  return {
    id: user.id,
    username: user.username,
    bio: user.bio,
    avatarInitials: user.avatarInitials,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
