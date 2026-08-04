import Link from "next/link";
import { Flame } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-12 text-white">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mx-auto mb-8 flex w-fit items-center gap-2"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500">
            <Flame size={22} />
          </span>

          <span className="text-xl font-bold">
            Skill<span className="text-violet-400">Builder</span>
          </span>
        </Link>

        <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur sm:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}