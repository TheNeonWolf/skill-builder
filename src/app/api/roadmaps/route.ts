import { NextResponse } from "next/server";

import { getAuthenticatedUserId } from "@/lib/auth";
import RoadmapService from "@/services/roadmap.service";

export async function GET() {
  try {
    const userId =
      await getAuthenticatedUserId();

    const roadmap =
      await RoadmapService.getActiveRoadmap(
        userId
      );

    return NextResponse.json({
      success: true,
      roadmap,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to retrieve your roadmap.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function POST() {
  try {
    const userId =
      await getAuthenticatedUserId();

    const roadmap =
      await RoadmapService.generateInitialMockRoadmap(
        userId
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Roadmap generated successfully.",
        roadmap,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to generate your roadmap.",
      },
      {
        status: 400,
      }
    );
  }
}