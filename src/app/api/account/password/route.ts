import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAuthenticatedUserId } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validations/auth";
import AccountService from "@/services/account.service";

export async function PATCH(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    const body: unknown = await request.json();
    const validatedData = changePasswordSchema.parse(body);

    await AccountService.changePassword(
      userId,
      validatedData
    );

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
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
            : "Unable to change password.",
      },
      {
        status: 400,
      }
    );
  }
}