const steps = [
  {
    number: "01",
    title: "Choose your career",
    description:
      "Tell SkillBuilder what career you want, what you already know and how much time you have.",
  },
  {
    number: "02",
    title: "Generate your roadmap",
    description:
      "Receive a personalized sequence of stages, skills, tasks and portfolio projects.",
  },
  {
    number: "03",
    title: "Complete real tasks",
    description:
      "Work through interactive checklists and update your progress as you learn.",
  },
  {
    number: "04",
    title: "Earn XP and level up",
    description:
      "Build momentum, unlock new stages and track how far you have progressed.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="font-semibold text-violet-400">How it works</p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            From uncertainty to a clear career journey
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {steps.map((step) => (
            <article
              key={step.number}
              className="flex gap-5 rounded-2xl border border-white/10 bg-white/3 p-6"
            >
              <div className="text-2xl font-bold text-violet-400">
                {step.number}
              </div>

              <div>
                <h3 className="text-xl font-semibold">{step.title}</h3>

                <p className="mt-2 leading-7 text-slate-400">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}