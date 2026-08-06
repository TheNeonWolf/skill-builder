import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAuthenticatedUserId } from "@/lib/auth";
import { updateChecklistItemSchema } from "@/lib/validations/roadmap";
import RoadmapProgressService from "@/services/roadmap-progress.service";

type RouteContext = {
  params: Promise<{
    taskId: string;
    itemId: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const userId =
      await getAuthenticatedUserId();

    const {
      taskId,
      itemId,
    } = await context.params;

    const body: unknown = await request.json();

    const validatedData =
      updateChecklistItemSchema.parse(body);

    const roadmap =
      await RoadmapProgressService.updateChecklistItem(
        userId,
        taskId,
        itemId,
        validatedData
      );

    return NextResponse.json({
      success: true,
      message:
        "Checklist item updated successfully.",
      roadmap,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a valid completed value.",
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
            : "Unable to update the checklist.",
      },
      {
        status: 400,
      }
    );
  }
}