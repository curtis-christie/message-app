import { createContext } from "react";

import type { LoginInput, RegisterInput } from "../api/auth";
import type { User } from "../types/user";

export type AuthContextValue = {
  user: User | null;
  isLoadingUser: boolean;
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
