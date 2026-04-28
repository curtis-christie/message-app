import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { getCurrentUser, loginUser, logoutUser, registerUser } from "../api/auth";
import { AuthContext, type AuthContextValue } from "./auth-context";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  const currentUserQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      queryClient.setQueryData(["auth", "me"], data);

      await queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      queryClient.setQueryData(["auth", "me"], data);

      await queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
    },
  });

  const user = currentUserQuery.data?.user ?? null;

  const value: AuthContextValue = {
    user,
    isLoadingUser: currentUserQuery.isLoading,
    register: async (input) => {
      await registerMutation.mutateAsync(input);
    },
    login: async (input) => {
      await loginMutation.mutateAsync(input);
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
    refreshUser: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
