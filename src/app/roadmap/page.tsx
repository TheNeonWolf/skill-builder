"use client";

import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FolderKanban,
  GraduationCap,
  Loader2,
  Lock,
  Sparkles,
  Trophy,
  Check
} from "lucide-react";
import { useEffect, useState } from "react";

import type {
  Roadmap,
  RoadmapApiResponse,
  RoadmapStage,
  RoadmapTask,
} from "@/types/roadmap";

function getTaskIcon(type: RoadmapTask["type"]) {
  switch (type) {
    case "project":
      return FolderKanban;

    case "assessment":
      return GraduationCap;

    default:
      return BookOpen;
  }
}

function getStageProgress(stage: RoadmapStage) {
  const totalTasks = stage.tasks.length;

  if (totalTasks === 0) {
    return 0;
  }

  const completedTasks = stage.tasks.filter(
    (task) => task.status === "completed"
  ).length;

  return Math.round(
    (completedTasks / totalTasks) * 100
  );
}

export default function RoadmapPage() {
  const [roadmap, setRoadmap] =
    useState<Roadmap | null>(null);

  const [expandedStageId, setExpandedStageId] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRoadmap() {
      try {
        const response = await fetch(
          "/api/roadmaps",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const result =
          (await response.json()) as RoadmapApiResponse;

        if (cancelled) {
          return;
        }

        if (!response.ok || !result.success) {
          setError(
            result.message ??
              "Unable to load your roadmap."
          );
          return;
        }

        setRoadmap(result.roadmap);

        const firstUnlockedStage =
          result.roadmap?.stages.find(
            (stage) =>
              stage.status !== "locked"
          );

        setExpandedStageId(
          firstUnlockedStage?.id ?? null
        );
      } catch {
        if (!cancelled) {
          setError(
            "Unable to connect to SkillBuilder."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadRoadmap();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-violet-400" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">
            Unable to load roadmap
          </h1>

          <p className="mt-3 text-slate-400">
            {error}
          </p>
        </div>
      </main>
    );
  }

  if (!roadmap) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="max-w-md text-center">
          <Sparkles className="mx-auto text-violet-400" />

          <h1 className="mt-4 text-2xl font-bold">
            No roadmap yet
          </h1>

          <p className="mt-3 text-slate-400">
            Generate a roadmap before viewing this page.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/5 p-6 sm:p-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="font-semibold text-violet-300">
                Your personalized path
              </p>

              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                {roadmap.title}
              </h1>

              <p className="mt-4 leading-7 text-slate-300">
                {roadmap.description}
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-white/10 bg-slate-950/50 p-5">
              <div className="flex items-center gap-3">
                <Trophy className="text-amber-300" />

                <div>
                  <p className="text-sm text-slate-400">
                    Overall progress
                  </p>

                  <p className="text-2xl font-bold">
                    {roadmap.progress}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-400">
                {roadmap.completedTasks} of{" "}
                {roadmap.totalTasks} tasks complete
              </span>

              <span className="text-slate-400">
                Version {roadmap.version}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-violet-500 transition-all"
                style={{
                  width: `${roadmap.progress}%`,
                }}
              />
            </div>
          </div>
        </header>

        <section className="mt-10 space-y-5">
          {roadmap.stages.map(
            (stage, index) => {
              const isLocked =
                stage.status === "locked";

              const isExpanded =
                expandedStageId === stage.id;

              const stageProgress =
                getStageProgress(stage);

              return (
                <article
                  key={stage.id}
                  className={`overflow-hidden rounded-2xl border ${
                    isLocked
                      ? "border-white/5 bg-white/[0.02] opacity-70"
                      : "border-white/10 bg-slate-900/70"
                  }`}
                >
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() =>
                      setExpandedStageId(
                        isExpanded
                          ? null
                          : stage.id
                      )
                    }
                    className="flex w-full items-center gap-5 p-5 text-left sm:p-6"
                  >
                    <div
                      className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
                        isLocked
                          ? "bg-white/5 text-slate-500"
                          : stage.status === "completed"
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-violet-400/10 text-violet-300"
                      }`}
                    >
                      {isLocked ? (
                        <Lock size={20} />
                      ) : stage.status ===
                        "completed" ? (
                        <CheckCircle2 size={22} />
                      ) : (
                        <span className="font-bold">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                          <h2 className="text-lg font-semibold">
                            {stage.title}
                          </h2>

                          <p className="mt-1 text-sm leading-6 text-slate-400">
                            {stage.description}
                          </p>
                        </div>

                        {!isLocked && (
                          <div className="shrink-0 text-sm text-slate-400">
                            {stageProgress}% complete
                          </div>
                        )}
                      </div>

                      {!isLocked && (
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-violet-500"
                            style={{
                              width: `${stageProgress}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {!isLocked &&
                      (isExpanded ? (
                        <ChevronUp className="shrink-0 text-slate-400" />
                      ) : (
                        <ChevronDown className="shrink-0 text-slate-400" />
                      ))}
                  </button>

                  {isExpanded &&
                    !isLocked && (
                      <div className="border-t border-white/10 p-5 sm:p-6">
                        <div className="space-y-4">
                          {stage.tasks.map(
                            (task) => {
                              const TaskIcon =
                                getTaskIcon(
                                  task.type
                                );

                              const completedChecklistItems =
                                task.checklist.filter(
                                  (item) =>
                                    item.completed
                                ).length;

                              return (
                                <div
                                  key={task.id}
                                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                                      <TaskIcon size={20} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-col justify-between gap-3 sm:flex-row">
                                        <div>
                                          <h3 className="font-semibold">
                                            {task.title}
                                          </h3>

                                          <p className="mt-2 text-sm leading-6 text-slate-400">
                                            {task.description}
                                          </p>
                                        </div>

                                        <span className="h-fit rounded-full bg-violet-400/10 px-3 py-1 text-xs font-semibold capitalize text-violet-200">
                                          {task.status.replace(
                                            "-",
                                            " "
                                          )}
                                        </span>
                                      </div>

                                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
                                        <span className="flex items-center gap-1.5">
                                          <Clock size={14} />
                                          {task.estimatedHours}h
                                        </span>

                                        <span className="capitalize">
                                          {task.difficulty}
                                        </span>

                                        <span>
                                          {task.xpReward} XP
                                        </span>

                                        <span>
                                          {completedChecklistItems}/
                                          {task.checklist.length} checklist items
                                        </span>
                                      </div>

                                      <div className="mt-5 space-y-2">
                                        {task.checklist.map(
                                          (item) => (
                                            <div
                                              key={item.id}
                                              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
                                            >
                                              <div
                                                className={`flex size-5 items-center justify-center rounded-full border ${
                                                  item.completed
                                                    ? "border-emerald-400 bg-emerald-400 text-slate-950"
                                                    : "border-white/20"
                                                }`}
                                              >
                                                {item.completed && (
                                                  <Check
                                                    size={13}
                                                  />
                                                )}
                                              </div>

                                              <span
                                                className={
                                                  item.completed
                                                    ? "text-slate-500 line-through"
                                                    : "text-slate-300"
                                                }
                                              >
                                                {item.title}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                </article>
              );
            }
          )}
        </section>
      </div>
    </main>
  );
}