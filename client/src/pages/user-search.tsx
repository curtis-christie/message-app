import { useState } from "react";
import type { SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";

import { searchUsers } from "../api/users";

export function UserSearch() {
  const [searchInput, setSearchInput] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const usersQuery = useQuery({
    queryKey: ["users", "search", submittedSearch],
    queryFn: () => searchUsers(submittedSearch),
    enabled: submittedSearch.trim().length > 0,
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedSearch(searchInput.trim());
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

        {!usersQuery.isFetching && submittedSearch && users.length === 0 && !usersQuery.isError ? (
          <p className="text-sm text-slate-400">No users found.</p>
        ) : null}

        {users.map((user) => (
          <article
            key={user.id}
            className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-950">
              {user.avatarInitials}
            </div>

            <div>
              <h3 className="font-semibold">@{user.username}</h3>
              <p className="text-sm text-slate-400">{user.bio || "No bio yet."}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
