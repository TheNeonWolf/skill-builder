import type {
    TaskDifficulty,
    TaskType,
} from "@/models/Roadmap";

const baseXpByType: Record<TaskType, number> = {
    learning: 40,
    assessment: 60,
    project: 120
};

const difficultyMultiplier: Record<TaskDifficulty, number>= {
    beginner: 1,
    intermediate: 1.5,
    advanced: 2
};

export function calculateTaskXp(
    type: TaskType,
    difficulty: TaskDifficulty,
    estimatedHours: number
): number {
    const baseXp = baseXpByType[type];
    const multiplier = difficultyMultiplier[difficulty];
    const timeBonus = Math.min(estimatedHours * 5, 100);
    const rawXp = baseXp * multiplier + timeBonus;
    return Math.round(rawXp / 10) * 10;
}