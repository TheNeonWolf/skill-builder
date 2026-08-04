import Link from "next/link";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-28 pt-24 text-center">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-sm text-violet-300">
          <Sparkles size={16} />
          AI-powered career development
        </div>

        <h1 className="max-w-5xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Turn your career goal into a{" "}
          <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            clear path forward
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
          SkillBuilder creates a personalized career roadmap, recommends
          portfolio projects and guides you with an AI mentor as you build
          real-world skills.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-6 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-violet-400"
          >
            Build my roadmap
            <ArrowRight size={18} />
          </Link>

          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/10"
          >
            <PlayCircle size={18} />
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}