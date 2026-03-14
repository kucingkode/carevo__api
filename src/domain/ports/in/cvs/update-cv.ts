import { cvContentSchema } from "@/domain/models/cv";
import z from "zod";

// request
export const updateCvInputSchema = z.object({
  requestUserId: z.uuidv7(),
  partialContent: cvContentSchema.partial(),
});

export type UpdateCvInput = z.infer<typeof updateCvInputSchema>;

// use case
export type UpdateCvUseCase = {
  updateCv(dto: UpdateCvInput): Promise<void>;
};
