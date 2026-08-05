import { calculateTaskXp } from "@/lib/xp";
import type {
  IRoadmapStage,
  TaskDifficulty,
  TaskType,
} from "@/models/Roadmap";

type MockTaskInput = {
  title: string;
  description: string;
  type: TaskType;
  difficulty: TaskDifficulty;
  estimatedHours: number;
  skills: string[];
  checklist: string[];
};

function createTask(
  task: MockTaskInput
) {
  return {
    title: task.title,
    description: task.description,
    type: task.type,
    difficulty: task.difficulty,
    estimatedHours: task.estimatedHours,
    skills: task.skills,

    xpReward: calculateTaskXp(
      task.type,
      task.difficulty,
      task.estimatedHours
    ),

    completionXpAwarded: false,

    status: "not-started" as const,
    startedAt: null,
    completedAt: null,

    checklist: task.checklist.map((title) => ({
      title,
      completed: false,
      completedAt: null,
      xpAwarded: false,
    })),
  };
}

export function generateMockRoadmap(
  careerTitle: string
): {
  title: string;
  description: string;
  stages: IRoadmapStage[];
} {
  const stages: IRoadmapStage[] = [
    {
      title: "Core Foundations",
      description:
        "Build the fundamental knowledge required for your chosen career.",
      order: 1,
      status: "unlocked",
      completionXpReward: 200,
      completionXpAwarded: false,

      tasks: [
        createTask({
          title: `Understand ${careerTitle} fundamentals`,
          description:
            "Learn the main responsibilities, tools, terminology, and workflows used in this career.",
          type: "learning",
          difficulty: "beginner",
          estimatedHours: 5,
          skills: [
            `${careerTitle} Fundamentals`,
          ],
          checklist: [
            "Research the role and its responsibilities",
            "Identify the main tools used in the field",
            "Write notes on important terminology",
            "Summarize what professionals do day to day",
          ],
        }),

        createTask({
          title: "Set up your learning environment",
          description:
            "Install and configure the essential tools needed to practise your skills.",
          type: "learning",
          difficulty: "beginner",
          estimatedHours: 3,
          skills: ["Development Tools", "Workflow"],
          checklist: [
            "Install the required software",
            "Create a practice workspace",
            "Configure version control",
            "Verify that the environment works",
          ],
        }),
      ],
    },

    {
      title: "Practical Skills",
      description:
        "Apply foundational concepts through guided exercises and small builds.",
      order: 2,
      status: "locked",
      completionXpReward: 250,
      completionXpAwarded: false,

      tasks: [
        createTask({
          title: "Complete a guided mini-project",
          description:
            "Build a small project that applies the core concepts from the first stage.",
          type: "project",
          difficulty: "beginner",
          estimatedHours: 8,
          skills: [
            "Problem Solving",
            "Project Development",
          ],
          checklist: [
            "Choose a clear project goal",
            "Plan the required features",
            "Build the first working version",
            "Test the main features",
            "Write a short project summary",
          ],
        }),

        createTask({
          title: "Review your foundational knowledge",
          description:
            "Check your understanding and identify any concepts requiring further practice.",
          type: "assessment",
          difficulty: "beginner",
          estimatedHours: 2,
          skills: ["Knowledge Review"],
          checklist: [
            "Review your notes",
            "Complete a short self-assessment",
            "List concepts you found difficult",
            "Create a revision plan",
          ],
        }),
      ],
    },

    {
      title: "Portfolio Development",
      description:
        "Build a larger project that demonstrates your skills to other people.",
      order: 3,
      status: "locked",
      completionXpReward: 300,
      completionXpAwarded: false,

      tasks: [
        createTask({
          title: `Build a ${careerTitle} portfolio project`,
          description:
            "Create a complete project demonstrating practical ability and thoughtful execution.",
          type: "project",
          difficulty: "intermediate",
          estimatedHours: 20,
          skills: [
            "Planning",
            "Implementation",
            "Documentation",
          ],
          checklist: [
            "Choose a real-world problem",
            "Define the project requirements",
            "Design the solution",
            "Build the core features",
            "Test and improve the project",
            "Publish the project",
            "Write portfolio documentation",
          ],
        }),
      ],
    },

    {
      title: "Career Preparation",
      description:
        "Prepare to present your skills through a resume, portfolio, and interview practice.",
      order: 4,
      status: "locked",
      completionXpReward: 350,
      completionXpAwarded: false,

      tasks: [
        createTask({
          title: "Prepare your career portfolio",
          description:
            "Organize your strongest projects and explain what each one demonstrates.",
          type: "project",
          difficulty: "intermediate",
          estimatedHours: 10,
          skills: [
            "Portfolio Development",
            "Communication",
          ],
          checklist: [
            "Select your strongest projects",
            "Write clear project descriptions",
            "Add links and screenshots",
            "Explain your contributions",
            "Review the portfolio for clarity",
          ],
        }),

        createTask({
          title: "Practise interview questions",
          description:
            "Prepare answers for technical and behavioural questions relevant to your chosen career.",
          type: "assessment",
          difficulty: "intermediate",
          estimatedHours: 6,
          skills: [
            "Interview Preparation",
            "Communication",
          ],
          checklist: [
            "Research common interview questions",
            "Write draft answers",
            "Complete a mock interview",
            "Review weak answers",
          ],
        }),
      ],
    },
  ];

  return {
    title: `${careerTitle} Career Roadmap`,
    description:
      `A structured learning journey designed to help you progress toward becoming a ${careerTitle}.`,
    stages,
  };
}