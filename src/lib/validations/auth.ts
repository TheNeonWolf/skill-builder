import { z } from "zod";

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must contain at least 2 characters")
            .max(50, "Name cannot contain more than 50 characters"),
        
        email: z
            .string()
            .trim()
            .email("Invalid email address")
            .toLowerCase()
            .max(254, "Email is too long"),

        password: z
            .string()
            .min(8, "Password must contain at least 8 characters")
            .max(100, "Password cannot contain more than 100 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                "Password too weak it must contain at least one uppercase letter, one lowercase letter and one number."
            ),
        
        confirmPassword: z.string(),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    );

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .toLowerCase(),
    
    password: z
        .string()
        .min(1, "Password is required")
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name cannot exceed 50 characters."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required."),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(100, "New password cannot exceed 100 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "New password must contain an uppercase letter, a lowercase letter and a number."
      ),

    confirmNewPassword: z.string(),
  })
  .refine(
    (data) => data.newPassword === data.confirmNewPassword,
    {
      message: "New passwords do not match.",
      path: ["confirmNewPassword"],
    }
  )
  .refine(
    (data) => data.currentPassword !== data.newPassword,
    {
      message:
        "Your new password must be different from your current password.",
      path: ["newPassword"],
    }
  );

export const deleteAccountSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required to delete your account."),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .min(1, "Reset token is required."),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(100, "New password cannot exceed 100 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "New password must contain an uppercase letter, a lowercase letter and a number."
      ),

    confirmNewPassword: z.string(),
  })
  .refine(
    (data) =>
      data.newPassword === data.confirmNewPassword,
    {
      message: "New passwords do not match.",
      path: ["confirmNewPassword"],
    }
  );

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;