import { z } from "zod";

export const updateChecklistItemSchema = z.object({
    completed: z.boolean()
});

export type UpdateChecklistItemInput = z.infer<
    typeof updateChecklistItemSchema
>;