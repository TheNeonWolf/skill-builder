import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
    try {
        await connectDB();

        return NextResponse.json(
            {
                success: true,
                message: "✅ Successfully connected to mongoDB",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("error", error);

        return NextResponse.json(
            {
                success: false,
                message: "❌ Failed to connect to mongoDB",
            },
            {
                status: 500,
            }
        );
    }
}