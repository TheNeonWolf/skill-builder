import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  getAuthenticatedUserId,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { deleteAccountSchema } from "@/lib/validations/auth";
import AccountService from "@/services/account.service";

export async function DELETE(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    const body: unknown = await request.json();
    const validatedData = deleteAccountSchema.parse(body);

    await AccountService.deleteAccount(
      userId,
      validatedData
    );

    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required.",
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
            : "Unable to delete account.",
      },
      {
        status: 400,
      }
    );
  }
}