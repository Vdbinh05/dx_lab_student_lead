import { z } from "zod";
import {
  bookmarkTargetTypes,
  evidenceTypes,
  missionSteps,
} from "@/lib/types";

export const missionIdSchema = z.string().trim().min(1).max(120);

export const missionBlockerInputSchema = z
  .object({
    missionId: missionIdSchema,
    notes: z.string().trim().min(12).max(2000),
  })
  .strict();

const safeWebUrlSchema = z
  .string()
  .url()
  .max(2048)
  .refine((value) => {
    try {
      const protocol = new URL(value).protocol;
      return protocol === "https:" || protocol === "http:";
    } catch {
      return false;
    }
  }, "URL chỉ được dùng http hoặc https");

export const missionStepInputSchema = z
  .object({
    missionId: missionIdSchema,
    step: z
      .enum(missionSteps)
      .refine(
        (step) => step !== "evidence" && step !== "quiz",
        "Evidence và quiz được tính tự động",
      ),
  })
  .strict();

export const evidenceInputSchema = z
  .object({
    missionId: missionIdSchema,
    type: z.enum(evidenceTypes),
    title: z.string().trim().min(3).max(120),
    content: z.string().trim().min(12).max(10000),
    url: z.union([z.literal(""), safeWebUrlSchema]).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.type === "github-url" && !value.url)
      context.addIssue({
        code: "custom",
        path: ["url"],
        message: "Evidence github-url bắt buộc có URL thật",
      });
  });

export const incidentInputSchema = z
  .object({
    incidentId: z.string().trim().min(1).max(120),
    symptom: z.string().trim().min(12).max(3000),
    evidence: z.string().trim().min(12).max(5000),
    hypothesis: z.string().trim().min(12).max(3000),
    test: z.string().trim().min(12).max(3000),
    result: z.string().trim().min(12).max(3000),
    rootCause: z.string().trim().min(12).max(3000),
    fix: z.string().trim().min(12).max(3000),
    verification: z.string().trim().min(12).max(5000),
    regression: z.string().trim().min(12).max(5000),
  })
  .strict();

export const assistanceInputSchema = z
  .object({
    incidentId: z.string().trim().min(1).max(120),
    level: z.enum(["HINT_1", "HINT_2", "SOLUTION"]),
  })
  .strict();

export const settingsInputSchema = z
  .object({
    dailyStudyMinutes: z.coerce
      .number()
      .refine((value) => [120, 240, 360, 480].includes(value)),
    acceleratedMode: z.boolean(),
  })
  .strict();

export const missionNoteInputSchema = z
  .object({
    missionId: missionIdSchema,
    content: z.string().trim().min(1).max(20000),
  })
  .strict();

export const bookmarkInputSchema = z
  .object({
    targetType: z.enum(bookmarkTargetTypes),
    targetId: z.string().trim().min(1).max(160),
    label: z.string().trim().min(1).max(160),
  })
  .strict();

export const weekNumberSchema = z.coerce.number().int().min(1).max(8);

export const oralReflectionInputSchema = z
  .object({
    questionId: z.string().trim().min(1).max(120),
    group: z.string().trim().min(1).max(80),
    response: z.string().trim().min(20).max(10000),
    confident: z.boolean(),
  })
  .strict();

export function formDataObject(formData: FormData) {
  return Object.fromEntries(
    [...formData.entries()].filter(([key]) => !key.startsWith("$ACTION_")),
  );
}
