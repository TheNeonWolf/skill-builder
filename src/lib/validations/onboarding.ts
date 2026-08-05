import { z } from "zod";

import {
  experienceLevels,
  learningPreferenceOptions,
} from "@/models/CareerProfile";

const skillSchema = z
  .string()
  .trim()
  .min(1, "Skill cannot be empty.")
  .max(50, "Skill cannot exceed 50 characters.");

export const onboardingSchema = z.object({
  careerTitle: z
    .string()
    .trim()
    .min(
      2,
      "Career title must contain at least 2 characters."
    )
    .max(
      100,
      "Career title cannot exceed 100 characters."
    ),

  experienceLevel: z.enum(experienceLevels, {
    message: "Please select your experience level.",
  }),

  existingSkills: z
    .array(skillSchema)
    .max(30, "You may add up to 30 skills.")
    .default([])
    .transform((skills) => [
      ...new Set(
        skills.map((skill) =>
          skill.trim().toLowerCase()
        )
      ),
    ]),

  weeklyHours: z.coerce
    .number()
    .int("Weekly hours must be a whole number.")
    .min(1, "Weekly hours must be at least 1.")
    .max(80, "Weekly hours cannot exceed 80."),

  targetTimelineMonths: z.coerce
    .number()
    .int("Timeline must be a whole number.")
    .min(1, "Timeline must be at least 1 month.")
    .max(
      36,
      "Timeline cannot exceed 36 months."
    ),

  learningPreferences: z
    .array(z.enum(learningPreferenceOptions))
    .min(
      1,
      "Select at least one learning preference."
    )
    .max(
      learningPreferenceOptions.length,
      "Too many learning preferences selected."
    ),

  motivation: z
    .string()
    .trim()
    .min(
      10,
      "Please explain your motivation in at least 10 characters."
    )
    .max(
      1000,
      "Motivation cannot exceed 1000 characters."
    ),
});

export type OnboardingInput = z.infer<
  typeof onboardingSchema
>;