import { connectDB } from "@/lib/db";
import type {
    ChangePasswordInput,
    DeleteAccountInput,
    UpdateProfileInput,
} from "@/lib/validations/auth";
import User from "@/models/User";

class AccountService {
  static async getCurrentUser(userId: string) {
    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User account not found.");
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl ?? null,
      globalXp: user.globalXp,
      activeCareerProfileId: user.activeCareerProfileId?.toString() ?? null,
      createdAt: user.createdAt,
    };
  }

  static async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ) {
    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User account not found.");
    }

    user.name = data.name;
    await user.save();

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl ?? null,
    };
  }

  static async changePassword(
    userId: string,
    data: ChangePasswordInput
  ) {
    await connectDB();

    const user = await User.findById(userId).select("+password");

    if (!user) {
      throw new Error("User account not found.");
    }

    const passwordMatches = await user.comparePassword(
      data.currentPassword
    );

    if (!passwordMatches) {
      throw new Error("Current password is incorrect.");
    }

    user.password = data.newPassword;
    await user.save();
  }

  static async deleteAccount(
    userId: string,
    data: DeleteAccountInput
  ) {
    await connectDB();

    const user = await User.findById(userId).select("+password");

    if (!user) {
      throw new Error("User account not found.");
    }

    const passwordMatches = await user.comparePassword(
      data.password
    );

    if (!passwordMatches) {
      throw new Error("Password is incorrect.");
    }

    await user.deleteOne();
  }
}

export default AccountService;