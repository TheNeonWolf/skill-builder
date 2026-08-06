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

    const roadmap =
      await RoadmapProgressService.startTask(
        userId,
        taskId
      );

    return NextResponse.json({
      success: true,
      message: "Task started successfully.",
      roadmap,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to start the task.",
      },
      {
        status: 400,
      }
    );
  }
}