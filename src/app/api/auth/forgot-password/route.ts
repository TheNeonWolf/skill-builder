import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import AuthService from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);

    await AuthService.requestPasswordReset(validatedData);

    return NextResponse.json({
      success: true,
      message:
        "If an account exists for that email, a reset link has been sent.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
          errors: error.flatten().fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    console.error("Forgot-password error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "We could not process the password-reset request.",
      },
      {
        status: 500,
      }
    );
  }
}