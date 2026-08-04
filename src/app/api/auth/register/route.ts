import { NextResponse } from "next/server";
import AuthService from "@/services/auth.service";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = registerSchema.parse(body);
        const user = await AuthService.register(validatedData);

        return NextResponse.json(
            {
                success: true,
                message: "Account created successfully",
                user,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong"
            },
            {
                status: 400,
            }
        );
    }
}