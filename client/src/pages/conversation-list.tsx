import type { Conversation } from "../types/conversation";
import type { User } from "../types/user";

function getOtherParticipant(conversation: Conversation, currentUser: User) {
  return conversation.participants.find((participant) => participant.userId !== currentUser.id)
    ?.user;
}

export function ConversationList({
  conversations,
  currentUser,
  selectedConversationId,
  onSelectConversation,
}: {
  conversations: Conversation[];
  currentUser: User;
  selectedConversationId: string;
  onSelectConversation: (conversationId: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <h2 className="text-lg font-semibold">Conversations</h2>
        <p className="mt-1 text-sm text-slate-400">
          Accepted message requests become conversations.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {conversations.length === 0 ? (
          <p className="text-sm text-slate-400">
            No conversations yet. Accept a message request to start one.
          </p>
        ) : null}

        {conversations.map((conversation) => {
          const otherUser = getOtherParticipant(conversation, currentUser);
          const latestMessage = conversation.messages[0];

          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                selectedConversationId === conversation.id
                  ? "border-slate-400 bg-slate-800"
                  : "border-slate-800 bg-slate-950 hover:bg-slate-900"
              }`}
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-950">
                  {otherUser?.avatarInitials ?? "?"}
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold">@{otherUser?.username ?? "Unknown user"}</h3>

                  <p className="truncate text-sm text-slate-400">
                    {latestMessage ? latestMessage.body : "No messages yet."}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
