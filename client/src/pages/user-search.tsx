import { useState } from "react";
import type { SubmitEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { sendMessageRequest } from "../api/message-requests";
import { searchUsers } from "../api/users";

export function UserSearch() {
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const usersQuery = useQuery({
    queryKey: ["users", "search", submittedSearch],
    queryFn: () => searchUsers(submittedSearch),
    enabled: submittedSearch.trim().length > 0,
  });

  const sendRequestMutation = useMutation({
    mutationFn: sendMessageRequest,
    onSuccess: async () => {
      setSuccessMessage("Message request sent.");
      await queryClient.invalidateQueries({
        queryKey: ["message-requests", "outgoing"],
      });
    },
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    setSubmittedSearch(searchInput.trim());
  }

  async function handleSendRequest(receiverId: string) {
    setSuccessMessage("");
    await sendRequestMutation.mutateAsync(receiverId);
  }

  const users = usersQuery.data?.users ?? [];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <h2 className="text-lg font-semibold">Find users</h2>
        <p className="mt-1 text-sm text-slate-400">Search for another user by username.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
        <input
          className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-slate-400"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search username..."
        />

        <button className="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-950 hover:bg-white">
          Search
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {usersQuery.isFetching ? <p className="text-sm text-slate-400">Searching...</p> : null}

        {usersQuery.isError ? (
          <p className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {usersQuery.error instanceof Error
              ? usersQuery.error.message
              : "Unable to search users."}
          </p>
        ) : null}

        {sendRequestMutation.isError ? (
          <p className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {sendRequestMutation.error instanceof Error
              ? sendRequestMutation.error.message
              : "Unable to send message request."}
          </p>
        ) : null}

        {successMessage ? (
          <p className="rounded-xl border border-emerald-900/60 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-200">
            {successMessage}
          </p>
        ) : null}

        {!usersQuery.isFetching && submittedSearch && users.length === 0 && !usersQuery.isError ? (
          <p className="text-sm text-slate-400">No users found.</p>
        ) : null}

        {users.map((user) => (
          <article
            key={user.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-950">
                {user.avatarInitials}
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold">@{user.username}</h3>
                <p className="truncate text-sm text-slate-400">{user.bio || "No bio yet."}</p>
              </div>
            </div>

            <button
              disabled={sendRequestMutation.isPending}
              onClick={() => handleSendRequest(user.id)}
              className="shrink-0 rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Request
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
