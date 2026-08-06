import mongoose, {
  type HydratedDocument,
  type Model,
  type Types,
} from "mongoose";

export const roadmapStatuses = [
  "active",
  "archived",
] as const;

export type RoadmapStatus =
  (typeof roadmapStatuses)[number];

export const stageStatuses = [
  "locked",
  "unlocked",
  "completed",
] as const;

export type StageStatus =
  (typeof stageStatuses)[number];

export const taskStatuses = [
  "not-started",
  "in-progress",
  "completed",
] as const;

export type TaskStatus =
  (typeof taskStatuses)[number];

export const taskTypes = [
  "learning",
  "project",
  "assessment",
] as const;

export type TaskType =
  (typeof taskTypes)[number];

export const taskDifficulties = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export type TaskDifficulty =
  (typeof taskDifficulties)[number];

export interface IChecklistItem {
  _id?: Types.ObjectId;
  title: string;
  completed: boolean;
  completedAt: Date | null;
}

export interface IRoadmapTask {
  _id?: Types.ObjectId;

  title: string;
  description: string;

  type: TaskType;
  difficulty: TaskDifficulty;

  estimatedHours: number;
  skills: string[];

  xpReward: number;
  completionXpAwarded: boolean;

  status: TaskStatus;
  startedAt: Date | null;
  completedAt: Date | null;

  checklist: IChecklistItem[];
}

export interface IRoadmapStage {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  order: number;

  status: StageStatus;
  completionXpReward: number;
  completionXpAwarded: boolean;

  tasks: IRoadmapTask[];
}

export interface IRoadmap {
  userId: Types.ObjectId;
  careerProfileId: Types.ObjectId;

  title: string;
  description: string;

  version: number;
  status: RoadmapStatus;

  generatedBy: "mock" | "gemini";
  generationReason: "initial" | "regenerated";

  stages: IRoadmapStage[];

  createdAt: Date;
  updatedAt: Date;
}

export type RoadmapDocument =
  HydratedDocument<IRoadmap>;

type RoadmapModel = Model<IRoadmap>;

const checklistItemSchema =
  new mongoose.Schema<IChecklistItem>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      completed: {
        type: Boolean,
        default: false,
      },

      completedAt: {
        type: Date,
        default: null,
      }
    }
  );

const roadmapTaskSchema =
  new mongoose.Schema<IRoadmapTask>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
      },

      type: {
        type: String,
        enum: taskTypes,
        required: true,
      },

      difficulty: {
        type: String,
        enum: taskDifficulties,
        required: true,
      },

      estimatedHours: {
        type: Number,
        required: true,
        min: 1,
        max: 200,
      },

      skills: {
        type: [
          {
            type: String,
            trim: true,
            maxlength: 50,
          },
        ],
        default: [],
      },

      xpReward: {
        type: Number,
        required: true,
        min: 0,
      },

      completionXpAwarded: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        enum: taskStatuses,
        default: "not-started",
      },

      startedAt: {
        type: Date,
        default: null,
      },

      completedAt: {
        type: Date,
        default: null,
      },

      checklist: {
        type: [checklistItemSchema],
        default: [],
      },
    }
  );

const roadmapStageSchema =
  new mongoose.Schema<IRoadmapStage>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
      },

      order: {
        type: Number,
        required: true,
        min: 1,
      },

      status: {
        type: String,
        enum: stageStatuses,
        default: "locked",
      },

      completionXpReward: {
        type: Number,
        required: true,
        min: 0,
        default: 200,
      },

      completionXpAwarded: {
        type: Boolean,
        default: false,
      },

      tasks: {
        type: [roadmapTaskSchema],
        default: [],
      },
    }
  );

const roadmapSchema = new mongoose.Schema<
  IRoadmap,
  RoadmapModel
>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    careerProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareerProfile",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500,
    },

    version: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    status: {
      type: String,
      enum: roadmapStatuses,
      default: "active",
    },

    generatedBy: {
      type: String,
      enum: ["mock", "gemini"],
      default: "mock",
    },

    generationReason: {
      type: String,
      enum: ["initial", "regenerated"],
      default: "initial",
    },

    stages: {
      type: [roadmapStageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

roadmapSchema.index({
  careerProfileId: 1,
  status: 1,
});

roadmapSchema.index({
  careerProfileId: 1,
  version: 1,
});

const Roadmap =
  (mongoose.models.Roadmap as
    | RoadmapModel
    | undefined) ??
  mongoose.model<IRoadmap, RoadmapModel>(
    "Roadmap",
    roadmapSchema
  );

export default Roadmap;