import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getConversations } from "../api/conversations";
import { useAuth } from "../providers/use-auth";
import { ConversationList } from "./conversation-list";
import { ConversationView } from "./conversation-view";
import { MessageRequestPanels } from "./message-request-panels";
import { ProfileEditor } from "./profile-editor";
import { UserSearch } from "./user-search";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState("");

  const conversationsQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const conversations = conversationsQuery.data?.conversations ?? [];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100">
      <section className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Messaging App</p>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-900"
          >
            Log out
          </button>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-950">
              {user?.avatarInitials}
            </div>

            <div>
              <h2 className="text-lg font-semibold">@{user?.username}</h2>
              <p className="text-sm text-slate-400">{user?.bio || "No bio yet."}</p>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[22rem_1fr]">
          <div className="space-y-6">
            {conversationsQuery.isLoading ? (
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">Loading conversations...</p>
              </section>
            ) : null}

            {conversationsQuery.isError ? (
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                  {conversationsQuery.error instanceof Error
                    ? conversationsQuery.error.message
                    : "Unable to load conversations."}
                </p>
              </section>
            ) : null}

            {!conversationsQuery.isLoading && !conversationsQuery.isError ? (
              <ConversationList
                conversations={conversations}
                currentUser={user!}
                selectedConversationId={selectedConversationId}
                onSelectConversation={setSelectedConversationId}
              />
            ) : null}

            <UserSearch />
          </div>

          <div>
            {selectedConversationId ? (
              <ConversationView conversationId={selectedConversationId} currentUser={user!} />
            ) : (
              <section className="flex min-h-128 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">Select a conversation to start messaging.</p>
              </section>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ProfileEditor />
          <MessageRequestPanels />
        </div>
      </section>
    </main>
  );
}
