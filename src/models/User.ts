import bcrypt from "bcryptjs";
import mongoose, {
    type HydratedDocument,
    type Model,
    type Types,
} from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    avatarUrl: string;
    globalXp: number;
    activeCareerProfileId: Types.ObjectId | null;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

type UserModel = Model<IUser, object, IUserMethods>;

const userSchema = new mongoose.Schema<
  IUser,
  UserModel,
  IUserMethods
>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: [50, "Name cannot contain more than 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [254, "Email is too long"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must contain at least 8 characters"],
      select: false,
    },

    avatarUrl: {
      type: String,
      trim: true,
      default: undefined,
    },

    globalXp: {
      type: Number,
      default: 0,
      min: [0, "Global XP cannot be negative"],
    },

    activeCareerProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareerProfile",
      default: null,
    },

    passwordResetToken: {
      type: String,
      select: false,
      default: undefined,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
      default: undefined,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.method(
    "comparePassword",
    async function (
        this: UserDocument,
        candidatePassword: string
    ): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.password);
    }
);

const User =
    (mongoose.models.User as UserModel | undefined) ??
    mongoose.model<IUser, UserModel>("User", userSchema);

export default User;