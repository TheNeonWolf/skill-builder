import { connectDB } from "@/lib/db";
import { generateMockRoadmap } from "@/lib/mock-roadmap";
import CareerProfile from "@/models/CareerProfile";
import Roadmap, {
  type RoadmapDocument,
} from "@/models/Roadmap";
import User from "@/models/User";

class RoadmapService {
  static async generateInitialMockRoadmap(
    userId: string
  ) {
    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User account not found.");
    }

    if (!user.activeCareerProfileId) {
      throw new Error(
        "Complete career onboarding before generating a roadmap."
      );
    }

    const careerProfile =
      await CareerProfile.findOne({
        _id: user.activeCareerProfileId,
        userId: user._id,
        status: "active",
      });

    if (!careerProfile) {
      throw new Error(
        "Active career profile not found."
      );
    }

    if (careerProfile.activeRoadmapId) {
      throw new Error(
        "Your active career profile already has a roadmap."
      );
    }

    const existingActiveRoadmap =
      await Roadmap.findOne({
        careerProfileId: careerProfile._id,
        status: "active",
      });

    if (existingActiveRoadmap) {
      throw new Error(
        "An active roadmap already exists."
      );
    }

    const generatedRoadmap =
      generateMockRoadmap(
        careerProfile.careerTitle
      );

    const roadmap = await Roadmap.create({
      userId: user._id,
      careerProfileId:
        careerProfile._id,

      title: generatedRoadmap.title,
      description:
        generatedRoadmap.description,

      version: 1,
      status: "active",

      generatedBy: "mock",
      generationReason: "initial",

      stages: generatedRoadmap.stages,
    });

    try {
      careerProfile.activeRoadmapId =
        roadmap._id;

      await careerProfile.save();
    } catch (error) {
      await Roadmap.findByIdAndDelete(
        roadmap._id
      );

      throw error;
    }

    return this.formatRoadmap(roadmap);
  }

  static async getActiveRoadmap(
    userId: string
  ) {
    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User account not found.");
    }

    if (!user.activeCareerProfileId) {
      return null;
    }

    const roadmap = await Roadmap.findOne({
      userId: user._id,
      careerProfileId:
        user.activeCareerProfileId,
      status: "active",
    });

    if (!roadmap) {
      return null;
    }

    return this.formatRoadmap(roadmap);
  }

  private static formatRoadmap(
    roadmap: RoadmapDocument
  ) {
    const totalTasks =
      roadmap.stages.reduce(
        (total, stage) =>
          total + stage.tasks.length,
        0
      );

    const completedTasks =
      roadmap.stages.reduce(
        (total, stage) =>
          total +
          stage.tasks.filter(
            (task) =>
              task.status === "completed"
          ).length,
        0
      );

    const progress =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) *
              100
          );

    return {
      id: roadmap._id.toString(),
      userId: roadmap.userId.toString(),
      careerProfileId:
        roadmap.careerProfileId.toString(),

      title: roadmap.title,
      description: roadmap.description,

      version: roadmap.version,
      status: roadmap.status,
      generatedBy: roadmap.generatedBy,
      generationReason:
        roadmap.generationReason,

      progress,
      totalTasks,
      completedTasks,

      stages: roadmap.stages.map(
        (stage) => ({
          id: stage._id?.toString() ?? "",
          title: stage.title,
          description: stage.description,
          order: stage.order,
          status: stage.status,
          completionXpReward:
            stage.completionXpReward,

          tasks: stage.tasks.map(
            (task) => ({
              id: task._id?.toString() ?? "",
              title: task.title,
              description:
                task.description,
              type: task.type,
              difficulty:
                task.difficulty,
              estimatedHours:
                task.estimatedHours,
              skills: task.skills,
              xpReward: task.xpReward,
              status: task.status,
              startedAt:
                task.startedAt?.toISOString() ??
                null,
              completedAt:
                task.completedAt?.toISOString() ??
                null,

              checklist:
                task.checklist.map(
                  (item) => ({
                    id: item._id?.toString() ?? "",
                    title: item.title,
                    completed:
                      item.completed,
                    completedAt:
                      item.completedAt?.toISOString() ??
                      null,
                  })
                ),
            })
          ),
        })
      ),

      createdAt:
        roadmap.createdAt.toISOString(),
      updatedAt:
        roadmap.updatedAt.toISOString(),
    };
  }
}

export default RoadmapService;