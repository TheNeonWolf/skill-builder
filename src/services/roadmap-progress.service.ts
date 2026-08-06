import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import type { UpdateChecklistItemInput } from "@/lib/validations/roadmap";
import { calculateLevelFromXp } from "@/lib/xp";
import CareerProfile from "@/models/CareerProfile";
import Roadmap, {
  type IRoadmapStage,
  type IRoadmapTask,
  type RoadmapDocument,
} from "@/models/Roadmap";
import User from "@/models/User";
import RoadmapService from "@/services/roadmap.service";

type TaskContext = {
  stage: IRoadmapStage;
  task: IRoadmapTask;
  stageIndex: number;
};

function findTaskContext(
  roadmap: RoadmapDocument,
  taskId: string
): TaskContext | null {
  for (
    let stageIndex = 0;
    stageIndex < roadmap.stages.length;
    stageIndex += 1
  ) {
    const stage = roadmap.stages[stageIndex];

    const task = stage.tasks.find(
      (currentTask) =>
        currentTask._id?.toString() === taskId
    );

    if (task) {
      return {
        stage,
        task,
        stageIndex,
      };
    }
  }

  return null;
}

class RoadmapProgressService {
  static async startTask(
    userId: string,
    taskId: string
  ) {
    await connectDB();

    const roadmap = await Roadmap.findOne({
      userId,
      status: "active",
    });

    if (!roadmap) {
      throw new Error("Active roadmap not found.");
    }

    const context = findTaskContext(roadmap, taskId);

    if (!context) {
      throw new Error("Task not found.");
    }

    const { stage, task } = context;

    if (stage.status === "locked") {
      throw new Error(
        "Complete the previous stage before starting this task."
      );
    }

    if (task.status === "completed") {
      throw new Error("This task is already completed.");
    }

    if (task.status === "not-started") {
      task.status = "in-progress";
      task.startedAt = new Date();

      await roadmap.save();
    }

    return RoadmapService.getActiveRoadmap(userId);
  }

  static async updateChecklistItem(
    userId: string,
    taskId: string,
    checklistItemId: string,
    data: UpdateChecklistItemInput
  ) {
    await connectDB();

    const roadmap = await Roadmap.findOne({
      userId,
      status: "active",
    });

    if (!roadmap) {
      throw new Error("Active roadmap not found.");
    }

    const context = findTaskContext(roadmap, taskId);

    if (!context) {
      throw new Error("Task not found.");
    }

    const { stage, task } = context;

    if (stage.status === "locked") {
      throw new Error("This stage is still locked.");
    }

    if (task.status === "not-started") {
      throw new Error(
        "Start the task before updating its checklist."
      );
    }

    if (task.status === "completed") {
      throw new Error(
        "A completed task cannot be changed."
      );
    }

    const checklistItem = task.checklist.find(
      (item) =>
        item._id?.toString() === checklistItemId
    );

    if (!checklistItem) {
      throw new Error("Checklist item not found.");
    }

    checklistItem.completed = data.completed;
    checklistItem.completedAt = data.completed
      ? new Date()
      : null;

    await roadmap.save();

    return RoadmapService.getActiveRoadmap(userId);
  }

  static async completeTask(
    userId: string,
    taskId: string
  ) {
    await connectDB();

    const session = await mongoose.startSession();

    let xpAwarded = 0;

    try {
      await session.withTransaction(async () => {
        const roadmap = await Roadmap.findOne({
          userId,
          status: "active",
        }).session(session);

        if (!roadmap) {
          throw new Error("Active roadmap not found.");
        }

        const context = findTaskContext(
          roadmap,
          taskId
        );

        if (!context) {
          throw new Error("Task not found.");
        }

        const {
          stage,
          task,
          stageIndex,
        } = context;

        if (stage.status === "locked") {
          throw new Error("This stage is still locked.");
        }

        if (task.status === "completed") {
          throw new Error(
            "This task is already completed."
          );
        }

        const allChecklistItemsCompleted =
          task.checklist.length === 0 ||
          task.checklist.every(
            (item) => item.completed
          );

        if (!allChecklistItemsCompleted) {
          throw new Error(
            "Complete every checklist item before completing the task."
          );
        }

        const now = new Date();

        task.status = "completed";
        task.startedAt ??= now;
        task.completedAt = now;

        if (!task.completionXpAwarded) {
          xpAwarded += task.xpReward;
          task.completionXpAwarded = true;
        }

        const stageIsComplete = stage.tasks.every(
          (stageTask) =>
            stageTask.status === "completed"
        );

        if (stageIsComplete) {
          stage.status = "completed";

          if (!stage.completionXpAwarded) {
            xpAwarded +=
              stage.completionXpReward;

            stage.completionXpAwarded = true;
          }

          const nextStage =
            roadmap.stages[stageIndex + 1];

          if (
            nextStage &&
            nextStage.status === "locked"
          ) {
            nextStage.status = "unlocked";
          }
        }

        const careerProfile =
          await CareerProfile.findOne({
            _id: roadmap.careerProfileId,
            userId,
            status: "active",
          }).session(session);

        if (!careerProfile) {
          throw new Error(
            "Active career profile not found."
          );
        }

        if (xpAwarded > 0) {
          careerProfile.careerXp += xpAwarded;
          careerProfile.careerLevel =
            calculateLevelFromXp(
              careerProfile.careerXp
            );

          await User.updateOne(
            {
              _id: userId,
            },
            {
              $inc: {
                globalXp: xpAwarded,
              },
            },
            {
              session,
            }
          );
        }

        await roadmap.save({
          session,
        });

        await careerProfile.save({
          session,
        });
      });
    } finally {
      await session.endSession();
    }

    const roadmap =
      await RoadmapService.getActiveRoadmap(
        userId
      );

    return {
      roadmap,
      xpAwarded,
    };
  }
}

export default RoadmapProgressService;