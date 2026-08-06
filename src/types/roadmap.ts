export type ChecklistItem = {
    id: string;
    title: string;
    completed: boolean;
    completedAt: string | null;
}

export type RoadmapTask = {
    id: string;
    title: string;
    description: string;
    type: "learning" | "project" | "assessment";
    difficulty: "beginner" | "intermediate" | "advanced";
    estimatedHours: number;
    skills: string[];
    xpReward: number;
    status: "not-started" | "in-progress" | "completed";
    startedAt: string | null;
    completedAt: string | null;
    checklist: ChecklistItem[];
};

export type RoadmapStage = {
    id: string;
    title: string;
    description: string;
    order: number;
    status: "locked" | "unlocked" | "completed";
    completionXpReward: number;
    tasks: RoadmapTask[];
}; 

export type Roadmap = {
    id: string;
    userId: string;
    careerProfileId: string;
    title: string;
    description: string;
    version: number;
    status: "active" | "archived";
    generatedBy: "mock" | "gemini";
    generationReason: "initial" | "regenerated";
    progress: number;
    totalTasks: number;
    completedTasks: number;
    stages: RoadmapStage[];
    createdAt: string;
    updatedAt: string;
};

export type RoadmapApiResponse = {
    success: boolean;
    message?: string;
    roadmap: Roadmap | null;
};