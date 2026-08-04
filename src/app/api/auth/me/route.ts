import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth";
import AccountService from "@/services/account.service";

export async function GET() {
    try {
        const userId = await getAuthenticatedUserId();
        const user = await AccountService.getCurrentUser(userId);

        return NextResponse.json({
            success: true,
            user,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                  error instanceof Error
                    ? error.message
                    : "Unable to retrieve user.",
            },
            {
              status: 401,
            }
        );
    }
}