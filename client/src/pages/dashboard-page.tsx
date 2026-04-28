import { useNavigate } from "react-router-dom";

import { useAuth } from "../providers/use-auth";
import { ProfileEditor } from "./profile-editor";
import { UserSearch } from "./user-search";
import { MessageRequestPanels } from "./message-request-panels";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100">
      <section className="mx-auto max-w-5xl">
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

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ProfileEditor />
          <UserSearch />
        </div>

        <div className="mt-8">
          <MessageRequestPanels />
        </div>
      </section>
    </main>
  );
}
