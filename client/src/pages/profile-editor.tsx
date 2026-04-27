import { useState } from "react";
import type { SubmitEvent } from "react";
import { useMutation } from "@tanstack/react-query";

import { updateMyProfile } from "../api/users";
import { useAuth } from "../providers/use-auth";

export function ProfileEditor() {
  const { user, refreshUser } = useAuth();

  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatarInitials, setAvatarInitials] = useState(user?.avatarInitials ?? "");
  const [successMessage, setSuccessMessage] = useState("");

  const updateProfileMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: async () => {
      setSuccessMessage("Profile updated.");
      await refreshUser();
    },
  });

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");

    await updateProfileMutation.mutateAsync({
      username,
      bio,
      avatarInitials,
    });
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <h2 className="text-lg font-semibold">Edit profile</h2>
        <p className="mt-1 text-sm text-slate-400">Update how other logged-in users see you.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Username</span>
          <input
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-slate-400"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Avatar initials</span>
          <input
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-slate-400"
            value={avatarInitials}
            onChange={(event) => setAvatarInitials(event.target.value)}
            maxLength={3}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Bio</span>
          <textarea
            className="mt-1 min-h-24 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-slate-400"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />
        </label>

        {updateProfileMutation.isError ? (
          <p className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {updateProfileMutation.error instanceof Error
              ? updateProfileMutation.error.message
              : "Unable to update profile."}
          </p>
        ) : null}

        {successMessage ? (
          <p className="rounded-xl border border-emerald-900/60 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-200">
            {successMessage}
          </p>
        ) : null}

        <button
          disabled={updateProfileMutation.isPending}
          className="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-950 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {updateProfileMutation.isPending ? "Saving..." : "Save profile"}
        </button>
      </form>
    </section>
  );
}
