import z from "zod";

// request
export const aiGenerateCvInputSchema = z.object({
  requestUserId: z.uuidv7(),
  input: z.string().max(2000),
  section: z.enum([
    "PROFILE",
    "WORK_EXPERIENCE_DESCRIPTION",
    "ORGANIZATION_DESCRIPTION",
    "COURSE_DESCRIPTION",
    "EDUCATION_DESCRIPTION",
  ]),
});

export type AiGenerateCvInput = z.infer<typeof aiGenerateCvInputSchema>;

// use case
export type AiGenerateCvUseCase = {
  aiGenerateCv(input: AiGenerateCvInput): AsyncIterable<string>;
};
