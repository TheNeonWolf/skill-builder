import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createAuthToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";
import AuthService from "@/services/auth.service";

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();
        const validateData = loginSchema.parse(body);
        const user = await AuthService.login(validateData);
        const token = await createAuthToken({
            userId: user.id
        });
        const cookieStore = await cookies();

        cookieStore.set("skillbuilder_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json({
            success: true,
            message: "Logged in successfully.",
            user,
        });

    } catch (error) {
        console.error("Login error:", error);

        if(error instanceof ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please check the submitted information.",
                    errors: error.flatten().fieldErrors
                },
                {
                    status: 400
                }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message:
                error instanceof Error
                    ? error.message
                    : "Unable to log in.",
            },
            {
                status: 401,
            }
        );
    }
}