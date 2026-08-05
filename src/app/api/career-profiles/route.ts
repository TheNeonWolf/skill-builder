import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAuthenticatedUserId } from "@/lib/auth";
import { onboardingSchema } from "@/lib/validations/onboarding";
import CareerProfileService from "@/services/career-profile.service";

export async function GET() {
  try {
    const userId =
      await getAuthenticatedUserId();

    const careerProfile =
      await CareerProfileService.getActiveProfile(
        userId
      );

    return NextResponse.json({
      success: true,
      careerProfile,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to retrieve the career profile.",
      },
      {
        status: 401,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId =
      await getAuthenticatedUserId();

    const body: unknown =
      await request.json();

    const validatedData =
      onboardingSchema.parse(body);

    const careerProfile =
      await CareerProfileService.createInitialProfile(
        userId,
        validatedData
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Career profile created successfully.",
        careerProfile,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please check your onboarding answers.",
          errors:
            error.flatten().fieldErrors,
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
            : "Unable to create the career profile.",
      },
      {
        status: 400,
      }
    );
  }
}