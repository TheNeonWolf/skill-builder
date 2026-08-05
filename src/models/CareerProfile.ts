import mongoose, {
    type HydratedDocument,
    type Model,
    type Types
} from "mongoose";

export const experienceLevels = [
    "complete-beginner",
    "beginner",
    "intermediate",
    "advanced",
] as const;

export type ExperienceLevel = (typeof experienceLevels)[number];

export const learningPreferenceOptions = [
    "projects",
    "reading",
    "videos",
    "quizzes",
    "interactive",
] as const;

export type LearningPreference = (typeof learningPreferenceOptions)[number];

export interface ISkillMastery {
    skillName: string;
    mastery: number;
}

export interface ICareerProfile {
    userId: Types.ObjectId;

    careerTitle: string;
    experienceLevel: ExperienceLevel;
    existingSkills: string[];

    weeklyHours: number;
    targetTimelineMonths: number;
    learningPreferences: LearningPreference[];
    motivation: string;

    careerXp: number;
    careerLevel: number;
    skillMastery: ISkillMastery[];

    activeRoadmapId: Types.ObjectId | null;
    status: "active" | "archived";

    createdAt: Date;
    updatedAt: Date;
}

export type CareerProfileDocument = HydratedDocument<ICareerProfile>;
type CareerProfileModel = Model<ICareerProfile>

const skillMasterySchema =
    new mongoose.Schema<ISkillMastery>(
        {
        skillName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },

        mastery: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 100,
        },
        },
        {
        _id: false,
        }
    );

const careerProfileSchema =
    new mongoose.Schema<
        ICareerProfile,
        CareerProfileModel
    >(
        {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        careerTitle: {
            type: String,
            required: [
            true,
            "Career title is required",
            ],
            trim: true,
            minlength: [
            2,
            "Career title must contain at least 2 characters",
            ],
            maxlength: [
            100,
            "Career title cannot exceed 100 characters",
            ],
        },

        experienceLevel: {
            type: String,
            required: true,
            enum: experienceLevels,
        },

        existingSkills: {
            type: [
            {
                type: String,
                trim: true,
                maxlength: 50,
            },
            ],
            default: [],
        },

        weeklyHours: {
            type: Number,
            required: true,
            min: [
            1,
            "Weekly hours must be at least 1",
            ],
            max: [
            80,
            "Weekly hours cannot exceed 80",
            ],
        },

        targetTimelineMonths: {
            type: Number,
            required: true,
            min: [
            1,
            "Timeline must be at least 1 month",
            ],
            max: [
            36,
            "Timeline cannot exceed 36 months",
            ],
        },

        learningPreferences: {
            type: [
            {
                type: String,
                enum: learningPreferenceOptions,
            },
            ],
            required: true,
        },

        motivation: {
            type: String,
            required: [
            true,
            "Career motivation is required",
            ],
            trim: true,
            minlength: [
            10,
            "Please provide a little more detail",
            ],
            maxlength: [
            1000,
            "Motivation cannot exceed 1000 characters",
            ],
        },

        careerXp: {
            type: Number,
            default: 0,
            min: 0,
        },

        careerLevel: {
            type: Number,
            default: 1,
            min: 1,
        },

        skillMastery: {
            type: [skillMasterySchema],
            default: [],
        },

        activeRoadmapId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Roadmap",
            default: null,
        },

        status: {
            type: String,
            enum: ["active", "archived"],
            default: "active",
        },
        },
        {
        timestamps: true,
        versionKey: false,
        }
    );

careerProfileSchema.index({
  userId: 1,
  status: 1,
});

const CareerProfile =
    (mongoose.models
        .CareerProfile as CareerProfileModel | undefined) ??
    mongoose.model<
        ICareerProfile,
        CareerProfileModel
    >("CareerProfile", careerProfileSchema);

export default CareerProfile;