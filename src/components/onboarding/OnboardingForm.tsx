"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

const careerOptions = [
  "Frontend Developer",
  "Backend Developer",
  "Full-Stack Developer",
  "Mobile App Developer",
  "AI Engineer",
  "Machine Learning Engineer",
  "Data Scientist",
  "Cybersecurity Engineer",
  "Cloud Engineer",
  "DevOps Engineer",
  "Game Developer",
  "UI/UX Designer",
];

const experienceOptions = [
  {
    value: "complete-beginner",
    title: "Complete beginner",
    description: "I am starting from scratch.",
  },
  {
    value: "beginner",
    title: "Beginner",
    description: "I understand some basic concepts.",
  },
  {
    value: "intermediate",
    title: "Intermediate",
    description: "I have built a few projects already.",
  },
  {
    value: "advanced",
    title: "Advanced",
    description: "I have strong experience in this field.",
  },
] as const;

const commonSkills = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "SQL",
  "Python",
  "Java",
  "Git",
  "Docker",
  "AWS",
  "Machine Learning",
];

const learningOptions = [
  {
    value: "projects",
    label: "Projects",
  },
  {
    value: "reading",
    label: "Reading",
  },
  {
    value: "videos",
    label: "Videos",
  },
  {
    value: "quizzes",
    label: "Quizzes",
  },
  {
    value: "interactive",
    label: "Interactive exercises",
  },
] as const;

type ExperienceLevel =
  (typeof experienceOptions)[number]["value"];

type LearningPreference =
  (typeof learningOptions)[number]["value"];

type OnboardingFormData = {
  careerTitle: string;
  experienceLevel: ExperienceLevel | "";
  existingSkills: string[];
  weeklyHours: number;
  targetTimelineMonths: number;
  learningPreferences: LearningPreference[];
  motivation: string;
};

type CareerProfileResponse = {
  success: boolean;
  message?: string;
  careerProfile?: {
    id: string;
    careerTitle: string;
  };
};

const totalSteps = 5;

export default function OnboardingForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [customSkill, setCustomSkill] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] =
    useState<OnboardingFormData>({
      careerTitle: "",
      experienceLevel: "",
      existingSkills: [],
      weeklyHours: 10,
      targetTimelineMonths: 6,
      learningPreferences: [],
      motivation: "",
    });

  const progress = useMemo(
    () => (currentStep / totalSteps) * 100,
    [currentStep]
  );

  const canContinue = useMemo(() => {
    switch (currentStep) {
      case 1:
        return formData.careerTitle.trim().length >= 2;

      case 2:
        return formData.experienceLevel !== "";

      case 3:
        return true;

      case 4:
        return (
          formData.weeklyHours >= 1 &&
          formData.targetTimelineMonths >= 1 &&
          formData.learningPreferences.length > 0
        );

      case 5:
        return formData.motivation.trim().length >= 10;

      default:
        return false;
    }
  }, [currentStep, formData]);

  const updateField = <K extends keyof OnboardingFormData>(
    field: K,
    value: OnboardingFormData[K]
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleSkill = (skill: string) => {
    const normalizedSkill = skill.trim();

    if (!normalizedSkill) {
      return;
    }

    setFormData((current) => {
      const alreadySelected =
        current.existingSkills.some(
          (existingSkill) =>
            existingSkill.toLowerCase() ===
            normalizedSkill.toLowerCase()
        );

      return {
        ...current,
        existingSkills: alreadySelected
          ? current.existingSkills.filter(
              (existingSkill) =>
                existingSkill.toLowerCase() !==
                normalizedSkill.toLowerCase()
            )
          : [
              ...current.existingSkills,
              normalizedSkill,
            ],
      };
    });
  };

  const addCustomSkill = () => {
    const skill = customSkill.trim();

    if (!skill) {
      return;
    }

    const alreadyExists =
      formData.existingSkills.some(
        (existingSkill) =>
          existingSkill.toLowerCase() ===
          skill.toLowerCase()
      );

    if (!alreadyExists) {
      updateField("existingSkills", [
        ...formData.existingSkills,
        skill,
      ]);
    }

    setCustomSkill("");
  };

  const toggleLearningPreference = (
    preference: LearningPreference
  ) => {
    setFormData((current) => {
      const alreadySelected =
        current.learningPreferences.includes(preference);

      return {
        ...current,
        learningPreferences: alreadySelected
          ? current.learningPreferences.filter(
              (item) => item !== preference
            )
          : [
              ...current.learningPreferences,
              preference,
            ],
      };
    });
  };

  const handleNext = () => {
    if (!canContinue || currentStep >= totalSteps) {
      return;
    }

    setServerError("");
    setCurrentStep((step) => step + 1);
  };

  const handleBack = () => {
    if (currentStep <= 1 || isSubmitting) {
      return;
    }

    setServerError("");
    setCurrentStep((step) => step - 1);
  };

  const handleSubmit = async () => {
    if (!canContinue || isSubmitting) {
      return;
    }

    setServerError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/career-profiles",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result =
        (await response.json()) as CareerProfileResponse;

      if (!response.ok || !result.success) {
        setServerError(
          result.message ??
            "Unable to create your career profile."
        );
        return;
      }

      /*
      * The career profile now exists, so generate its initial roadmap.
      */
      const roadmapResponse = await fetch("/api/roadmaps", {
        method: "POST",
        credentials: "include",
      });

      const roadmapResult = (await roadmapResponse.json()) as {
        success: boolean;
        message?: string;
      };

      if (!roadmapResponse.ok || !roadmapResult.success) {
        setServerError(
          roadmapResult.message ??
            "Your career profile was created, but the roadmap could not be generated."
        );
        return;
      }

      await refreshUser();

      router.push("/dashboard");
      router.refresh();
    } catch {
      setServerError(
        "Unable to connect to SkillBuilder. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <div className="mb-4 flex items-center justify-between gap-4 text-sm">
            <span className="font-medium text-violet-300">
              Career setup
            </span>

            <span className="text-slate-400">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl sm:p-10">
          {serverError && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
            >
              {serverError}
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <div className="mb-8">
                <p className="font-semibold text-violet-400">
                  Choose your destination
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  What career do you want to pursue?
                </h1>

                <p className="mt-3 text-slate-400">
                  SkillBuilder will create a personalized
                  roadmap based on this goal.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {careerOptions.map((career) => {
                  const selected =
                    formData.careerTitle === career;

                  return (
                    <button
                      key={career}
                      type="button"
                      onClick={() =>
                        updateField(
                          "careerTitle",
                          career
                        )
                      }
                      className={`flex items-center justify-between rounded-xl border px-4 py-4 text-left transition ${
                        selected
                          ? "border-violet-400 bg-violet-400/10 text-white"
                          : "border-white/10 bg-slate-950/50 text-slate-300 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      <span className="font-medium">
                        {career}
                      </span>

                      {selected && (
                        <Check
                          size={18}
                          className="text-violet-300"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5">
                <label
                  htmlFor="customCareer"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Or enter another career
                </label>

                <input
                  id="customCareer"
                  type="text"
                  value={formData.careerTitle}
                  onChange={(event) =>
                    updateField(
                      "careerTitle",
                      event.target.value
                    )
                  }
                  placeholder="For example: Robotics Engineer"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="mb-8">
                <p className="font-semibold text-violet-400">
                  Starting point
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  What is your current experience?
                </h1>

                <p className="mt-3 text-slate-400">
                  This helps us avoid making your roadmap too
                  easy or too advanced.
                </p>
              </div>

              <div className="space-y-3">
                {experienceOptions.map((option) => {
                  const selected =
                    formData.experienceLevel ===
                    option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        updateField(
                          "experienceLevel",
                          option.value
                        )
                      }
                      className={`w-full rounded-xl border p-5 text-left transition ${
                        selected
                          ? "border-violet-400 bg-violet-400/10"
                          : "border-white/10 bg-slate-950/50 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="font-semibold">
                            {option.title}
                          </h2>

                          <p className="mt-1 text-sm text-slate-400">
                            {option.description}
                          </p>
                        </div>

                        {selected && (
                          <Check
                            size={20}
                            className="shrink-0 text-violet-300"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="mb-8">
                <p className="font-semibold text-violet-400">
                  Existing knowledge
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  Which skills do you already know?
                </h1>

                <p className="mt-3 text-slate-400">
                  You may skip this step if you are starting
                  from scratch.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {commonSkills.map((skill) => {
                  const selected =
                    formData.existingSkills.some(
                      (existingSkill) =>
                        existingSkill.toLowerCase() ===
                        skill.toLowerCase()
                    );

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        selected
                          ? "border-violet-400 bg-violet-400/15 text-violet-200"
                          : "border-white/10 bg-slate-950/50 text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {selected && (
                        <Check
                          size={14}
                          className="mr-1 inline"
                        />
                      )}

                      {skill}
                    </button>
                  );
                })}
              </div>

              <div className="mt-7 flex gap-3">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(event) =>
                    setCustomSkill(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addCustomSkill();
                    }
                  }}
                  placeholder="Add another skill"
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                />

                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-4 font-semibold transition hover:bg-white/10"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>

              {formData.existingSkills.length > 0 && (
                <div className="mt-7 rounded-2xl border border-white/10 bg-white/3 p-5">
                  <p className="mb-3 text-sm font-medium text-slate-300">
                    Selected skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {formData.existingSkills.map(
                      (skill) => (
                        <span
                          key={skill}
                          className="flex items-center gap-2 rounded-full bg-violet-400/10 px-3 py-1.5 text-sm text-violet-200"
                        >
                          {skill}

                          <button
                            type="button"
                            onClick={() =>
                              toggleSkill(skill)
                            }
                            aria-label={`Remove ${skill}`}
                            className="rounded-full p-0.5 hover:bg-white/10"
                          >
                            <X size={13} />
                          </button>
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <div className="mb-8">
                <p className="font-semibold text-violet-400">
                  Your learning plan
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  How should your roadmap fit your life?
                </h1>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="weeklyHours"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Hours available each week
                  </label>

                  <input
                    id="weeklyHours"
                    type="number"
                    min={1}
                    max={80}
                    value={formData.weeklyHours}
                    onChange={(event) =>
                      updateField(
                        "weeklyHours",
                        Number(event.target.value)
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="timeline"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Target timeline in months
                  </label>

                  <input
                    id="timeline"
                    type="number"
                    min={1}
                    max={36}
                    value={
                      formData.targetTimelineMonths
                    }
                    onChange={(event) =>
                      updateField(
                        "targetTimelineMonths",
                        Number(event.target.value)
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                  />
                </div>
              </div>

              <div className="mt-8">
                <p className="mb-3 text-sm font-medium text-slate-300">
                  How do you prefer to learn?
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {learningOptions.map((option) => {
                    const selected =
                      formData.learningPreferences.includes(
                        option.value
                      );

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          toggleLearningPreference(
                            option.value
                          )
                        }
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                          selected
                            ? "border-violet-400 bg-violet-400/10"
                            : "border-white/10 bg-slate-950/50 hover:border-white/20 hover:bg-white/5"
                        }`}
                      >
                        <span>{option.label}</span>

                        {selected && (
                          <Check
                            size={18}
                            className="text-violet-300"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <div className="mb-8">
                <p className="font-semibold text-violet-400">
                  Personalize your journey
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  Why do you want to pursue this career?
                </h1>

                <p className="mt-3 text-slate-400">
                  Your motivation will help the AI recommend
                  more relevant projects and milestones.
                </p>
              </div>

              <textarea
                value={formData.motivation}
                onChange={(event) =>
                  updateField(
                    "motivation",
                    event.target.value
                  )
                }
                rows={7}
                maxLength={1000}
                placeholder="For example: I want to become a full-stack developer so I can build my own products and prepare for software engineering internships."
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 leading-7 outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
              />

              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Minimum 10 characters
                </span>

                <span>
                  {formData.motivation.length}/1000
                </span>
              </div>

              <div className="mt-8 rounded-2xl border border-violet-400/20 bg-violet-400/10 p-5">
                <div className="flex gap-3">
                  <Sparkles className="mt-0.5 shrink-0 text-violet-300" />

                  <div>
                    <h2 className="font-semibold text-violet-100">
                      Ready to build your roadmap
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-violet-200/70">
                      Your career profile will be saved first.
                      The AI roadmap generator will be connected
                      in the next development phase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <footer className="mt-10 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={
                currentStep === 1 || isSubmitting
              }
              className="flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canContinue}
                className="flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-semibold transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canContinue || isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-semibold transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Building your career path...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Create my career path
                  </>
                )}
              </button>
            )}
          </footer>
        </section>
      </div>
    </main>
  );
}