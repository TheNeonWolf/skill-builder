import { connectDB } from "@/lib/db";
import type { OnboardingInput } from "@/lib/validations/onboarding";
import CareerProfile from "@/models/CareerProfile";
import User from "@/models/User";

class CareerProfileService {
  static async createInitialProfile(
    userId: string,
    data: OnboardingInput
  ) {
    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User account not found.");
    }

    if (user.activeCareerProfileId) {
      throw new Error(
        "You already have an active career profile."
      );
    }

    const careerProfile =
      await CareerProfile.create({
        userId: user._id,

        careerTitle: data.careerTitle,
        experienceLevel:
          data.experienceLevel,
        existingSkills:
          data.existingSkills,

        weeklyHours: data.weeklyHours,
        targetTimelineMonths:
          data.targetTimelineMonths,
        learningPreferences:
          data.learningPreferences,
        motivation: data.motivation,

        careerXp: 0,
        careerLevel: 1,
        skillMastery: [],

        activeRoadmapId: null,
        status: "active",
      });

    try {
      user.activeCareerProfileId =
        careerProfile._id;

      await user.save();
    } catch (error) {
      await CareerProfile.findByIdAndDelete(
        careerProfile._id
      );

      throw error;
    }

    return this.formatProfile(careerProfile);
  }

  static async getActiveProfile(
    userId: string
  ) {
    await connectDB();

    const careerProfile =
      await CareerProfile.findOne({
        userId,
        status: "active",
      });

    if (!careerProfile) {
      return null;
    }

    return this.formatProfile(careerProfile);
  }

  private static formatProfile(
    careerProfile: InstanceType<
      typeof CareerProfile
    >
  ) {
    return {
      id: careerProfile._id.toString(),
      userId:
        careerProfile.userId.toString(),

      careerTitle:
        careerProfile.careerTitle,
      experienceLevel:
        careerProfile.experienceLevel,
      existingSkills:
        careerProfile.existingSkills,

      weeklyHours:
        careerProfile.weeklyHours,
      targetTimelineMonths:
        careerProfile.targetTimelineMonths,
      learningPreferences:
        careerProfile.learningPreferences,
      motivation:
        careerProfile.motivation,

      careerXp:
        careerProfile.careerXp,
      careerLevel:
        careerProfile.careerLevel,
      skillMastery:
        careerProfile.skillMastery,

      activeRoadmapId:
        careerProfile.activeRoadmapId?.toString() ??
        null,

      status: careerProfile.status,
      createdAt:
        careerProfile.createdAt.toISOString(),
      updatedAt:
        careerProfile.updatedAt.toISOString(),
    };
  }
}

export default CareerProfileService;