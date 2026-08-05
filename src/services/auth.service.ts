import User from "@/models/User";
import { connectDB } from "@/lib/db";
import crypto from "crypto";
import { sendMail } from "@/lib/mail";
import type {
    RegisterInput,
    LoginInput,
    ResetPasswordInput,
    ForgotPasswordInput,
} from "@/lib/validations/auth";

class AuthService {
    static async register(data: RegisterInput) {
        await connectDB();

        const existingUser = await User.findOne({
            email: data.email,
        });

        if(existingUser) {
            throw new Error("An account with this email already exists.");
        }

        const user = await User.create({
            name: data.name,
            email: data.email,
            password: data.password,
        });

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl ?? null,
            globalXp: user.globalXp,
            activeCareerProfileId:
                user.activeCareerProfileId?.toString() ?? null,
            createdAt: user.createdAt.toISOString(),
        };
    }

    static async login(data: LoginInput) {
        await connectDB();

        const user = await User.findOne({
            email: data.email
        }).select("+password");

        if(!user) {
            throw new Error("Invalid email or password.");
        }

        const passwordMatches = await user.comparePassword(data.password);

        if(!passwordMatches) {
            throw new Error("Invalid email or password.");
        }

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl ?? null,
            globalXp: user.globalXp,
            activeCareerProfileId:
                user.activeCareerProfileId?.toString() ?? null,
            createdAt: user.createdAt.toISOString(),
        };
    }

    static async requestPasswordReset(
        data: ForgotPasswordInput
    ): Promise<void> {
        await connectDB();

        const user = await User.findOne({
            email: data.email,
        });

        /*
        * Always return normally when no account exists.
        * This avoids revealing which email addresses are registered.
        */
        if (!user) {
            return;
        }

        const rawToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");

        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await user.save();

        const appUrl = process.env.APP_URL ?? "http://localhost:3000";
        const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

        try {
            await sendMail({
            to: user.email,
            subject: "Reset your SkillBuilder password",
            text:
                `Reset your SkillBuilder password using this link: ` +
                `${resetUrl}\n\nThis link expires in 15 minutes.`,

            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h1 style="font-size: 24px;">Reset your password</h1>

                <p>
                    We received a request to reset your SkillBuilder password.
                </p>

                <p>
                    <a
                    href="${resetUrl}"
                    style="
                        display: inline-block;
                        padding: 12px 18px;
                        background: #7c3aed;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 8px;
                    "
                    >
                    Reset password
                    </a>
                </p>

                <p>This link expires in 15 minutes.</p>

                <p>
                    If you did not request this, you can ignore this email.
                </p>
                </div>
            `,
            });
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            throw error;
        }
        }

    static async resetPassword(
        data: ResetPasswordInput
    ): Promise<void> {
        await connectDB();

        const hashedToken = crypto
            .createHash("sha256")
            .update(data.token)
            .digest("hex");

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {
            $gt: new Date(),
            },
        }).select(
            "+password +passwordResetToken +passwordResetExpires"
        );

        if (!user) {
            throw new Error(
            "This password-reset link is invalid or has expired."
            );
        }

        user.password = data.newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();
    }
}

export default AuthService;