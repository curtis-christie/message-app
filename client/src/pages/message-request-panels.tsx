import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  acceptMessageRequest,
  declineMessageRequest,
  getIncomingMessageRequests,
  getOutgoingMessageRequests,
} from "../api/message-requests";
import type { MessageRequest } from "../types/message-request";

function RequestUserSummary({
  request,
  direction,
}: {
  request: MessageRequest;
  direction: "incoming" | "outgoing";
}) {
  const user = direction === "incoming" ? request.sender : request.receiver;

  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-950">
        {user.avatarInitials}
      </div>

      <div className="min-w-0">
        <h3 className="font-semibold">@{user.username}</h3>
        <p className="truncate text-sm text-slate-400">{user.bio || "No bio yet."}</p>
      </div>
    </div>
  );
}

export function MessageRequestPanels() {
  const queryClient = useQueryClient();

  const incomingQuery = useQuery({
    queryKey: ["message-requests", "incoming"],
    queryFn: getIncomingMessageRequests,
  });

  const outgoingQuery = useQuery({
    queryKey: ["message-requests", "outgoing"],
    queryFn: getOutgoingMessageRequests,
  });

  const acceptMutation = useMutation({
    mutationFn: acceptMessageRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["message-requests", "incoming"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["conversations"],
        }),
      ]);
    },
  });

  const declineMutation = useMutation({
    mutationFn: declineMessageRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["message-requests", "incoming"],
      });
    },
  });

  const incomingRequests = incomingQuery.data?.messageRequests ?? [];
  const outgoingRequests = outgoingQuery.data?.messageRequests ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div>
          <h2 className="text-lg font-semibold">Incoming requests</h2>
          <p className="mt-1 text-sm text-slate-400">
            Accept or decline users who want to message you.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {incomingQuery.isLoading ? (
            <p className="text-sm text-slate-400">Loading incoming requests...</p>
          ) : null}

          {incomingQuery.isError ? (
            <p className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
              {incomingQuery.error instanceof Error
                ? incomingQuery.error.message
                : "Unable to load incoming requests."}
            </p>
          ) : null}

          {!incomingQuery.isLoading && !incomingQuery.isError && incomingRequests.length === 0 ? (
            <p className="text-sm text-slate-400">No incoming requests.</p>
          ) : null}

          {incomingRequests.map((request) => (
            <article
              key={request.id}
              className="space-y-4 rounded-xl border border-slate-800 bg-slate-950 p-4"
            >
              <RequestUserSummary request={request} direction="incoming" />

              <div className="flex gap-3">
                <button
                  disabled={acceptMutation.isPending || declineMutation.isPending}
                  onClick={() => acceptMutation.mutate(request.id)}
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Accept
                </button>

                <button
                  disabled={acceptMutation.isPending || declineMutation.isPending}
                  onClick={() => declineMutation.mutate(request.id)}
                  className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Decline
                </button>
              </div>
            </article>
          ))}

          {acceptMutation.isError ? (
            <p className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
              {acceptMutation.error instanceof Error
                ? acceptMutation.error.message
                : "Unable to accept request."}
            </p>
          ) : null}

          {declineMutation.isError ? (
            <p className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
              {declineMutation.error instanceof Error
                ? declineMutation.error.message
                : "Unable to decline request."}
            </p>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div>
          <h2 className="text-lg font-semibold">Outgoing requests</h2>
          <p className="mt-1 text-sm text-slate-400">
            Requests you have sent that are still waiting.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {outgoingQuery.isLoading ? (
            <p className="text-sm text-slate-400">Loading outgoing requests...</p>
          ) : null}

          {outgoingQuery.isError ? (
            <p className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
              {outgoingQuery.error instanceof Error
                ? outgoingQuery.error.message
                : "Unable to load outgoing requests."}
            </p>
          ) : null}

          {!outgoingQuery.isLoading && !outgoingQuery.isError && outgoingRequests.length === 0 ? (
            <p className="text-sm text-slate-400">No outgoing requests.</p>
          ) : null}

          {outgoingRequests.map((request) => (
            <article
              key={request.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4"
            >
              <RequestUserSummary request={request} direction="outgoing" />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
