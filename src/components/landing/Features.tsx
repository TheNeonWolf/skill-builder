import {
  Bot,
  FolderKanban,
  Map,
  Trophy,
} from "lucide-react";

const features = [
  {
    title: "Personalized roadmap",
    description:
      "Receive a structured career journey based on your goals, experience and available time.",
    icon: Map,
  },
  {
    title: "AI career mentor",
    description:
      "Get explanations, suggestions and guidance based on your current roadmap progress.",
    icon: Bot,
  },
  {
    title: "Career projects",
    description:
      "Generate portfolio projects matched to your skills, career target and experience level.",
    icon: FolderKanban,
  },
  {
    title: "XP and progression",
    description:
      "Complete tasks, earn XP, unlock stages and watch your career profile grow.",
    icon: Trophy,
  },
];

export default function Features() {
  return (
    <section className="border-y border-white/10 bg-white/3">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-semibold text-violet-400">Everything you need</p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Stop wondering what to learn next
          </h2>

          <p className="mt-4 text-slate-400">
            SkillBuilder breaks ambitious career goals into manageable,
            trackable steps.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-violet-400/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-400/15 text-violet-300">
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}