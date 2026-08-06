import { NextResponse } from "next/server";

import { getAuthenticatedUserId } from "@/lib/auth";
import RoadmapProgressService from "@/services/roadmap-progress.service";

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function PATCH(
  _request: Request,
  context: RouteContext
) {
  try {
    const userId =
      await getAuthenticatedUserId();

    const { taskId } = await context.params;

    const result =
      await RoadmapProgressService.completeTask(
        userId,
        taskId
      );

    return NextResponse.json({
      success: true,
      message:
        result.xpAwarded > 0
          ? `Task completed! You earned ${result.xpAwarded} XP.`
          : "Task completed successfully.",
      xpAwarded: result.xpAwarded,
      roadmap: result.roadmap,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to complete the task.",
      },
      {
        status: 400,
      }
    );
  }
}