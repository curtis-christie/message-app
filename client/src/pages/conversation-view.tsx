import { useState } from "react";
import type { SubmitEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getConversationById, sendMessage } from "../api/conversations";
import type { Conversation } from "../types/conversation";
import type { User } from "../types/user";

function getOtherParticipant(conversation: Conversation, currentUser: User) {
  return conversation.participants.find((participant) => participant.userId !== currentUser.id)
    ?.user;
}

export function ConversationView({
  conversationId,
  currentUser,
}: {
  conversationId: string;
  currentUser: User;
}) {
  const queryClient = useQueryClient();
  const [messageBody, setMessageBody] = useState("");

  const conversationQuery = useQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () => getConversationById(conversationId),
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: async () => {
      setMessageBody("");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["conversations"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["conversations", conversationId],
        }),
      ]);
    },
  });

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = messageBody.trim();

    if (!trimmedMessage) {
      return;
    }

    await sendMessageMutation.mutateAsync({
      conversationId,
      body: trimmedMessage,
    });
  }

  if (conversationQuery.isLoading) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-slate-400">Loading conversation...</p>
      </section>
    );
  }

  if (conversationQuery.isError) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {conversationQuery.error instanceof Error
            ? conversationQuery.error.message
            : "Unable to load conversation."}
        </p>
      </section>
    );
  }

  if (!conversationQuery.data) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-slate-400">Conversation not found.</p>
      </section>
    );
  }

  const conversation = conversationQuery.data.conversation;
  const otherUser = getOtherParticipant(conversation, currentUser);

  return (
    <section className="flex min-h-128 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-semibold">@{otherUser?.username ?? "Unknown user"}</h2>
        <p className="text-sm text-slate-400">{otherUser?.bio || "No bio yet."}</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto py-6">
        {conversation.messages.length === 0 ? (
          <p className="text-sm text-slate-400">No messages yet. Send the first message.</p>
        ) : null}

        {conversation.messages.map((message) => {
          const isMine = message.senderId === currentUser.id;

          return (
            <article
              key={message.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  isMine ? "bg-slate-100 text-slate-950" : "bg-slate-800 text-slate-100"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.body}</p>
              </div>
            </article>
          );
        })}
      </div>

      {sendMessageMutation.isError ? (
        <p className="mb-3 rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {sendMessageMutation.error instanceof Error
            ? sendMessageMutation.error.message
            : "Unable to send message."}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="flex gap-3 border-t border-slate-800 pt-4">
        <input
          className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-slate-400"
          value={messageBody}
          onChange={(event) => setMessageBody(event.target.value)}
          placeholder="Write a message..."
        />

        <button
          disabled={sendMessageMutation.isPending}
          className="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-950 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sendMessageMutation.isPending ? "Sending..." : "Send"}
        </button>
      </form>
    </section>
  );
}
