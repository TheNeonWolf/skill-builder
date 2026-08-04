import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { resetPasswordSchema } from "@/lib/validations/auth";
import AuthService from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const validatedData = resetPasswordSchema.parse(body);

    await AuthService.resetPassword(validatedData);

    return NextResponse.json({
      success: true,
      message:
        "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the submitted information.",
          errors: error.flatten().fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to reset password.",
      },
      {
        status: 400,
      }
    );
  }
}