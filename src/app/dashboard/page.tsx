"use client";

import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const router = useRouter();

  const {
    user,
    isLoading,
    logout,
  } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-violet-400" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-medium text-violet-400">
              SkillBuilder
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Welcome, {user?.name}
            </h1>

            <p className="mt-2 text-slate-400">
              Your career profile is ready. Your roadmap will
              appear here next.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/3 p-6">
            <p className="text-sm text-slate-400">
              Global XP
            </p>

            <p className="mt-2 text-3xl font-bold">
              {user?.globalXp ?? 0}
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/3 p-6">
            <p className="text-sm text-slate-400">
              Career profile
            </p>

            <p className="mt-2 text-lg font-semibold text-emerald-300">
              Active
            </p>
          </article>
        </div>
      </div>
    </main>
  );
}