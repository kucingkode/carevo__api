import { cvPartialUpdateSchema } from "@/domain/entities/cv";
import z from "zod";

// request
export const updateCvInputSchema = z.object({
  requestUserId: z.uuidv7(),
  userId: z.uuidv7(),
  partialCv: cvPartialUpdateSchema.partial(),
});

export type UpdateCvInput = z.infer<typeof updateCvInputSchema>;

// use case
export type UpdateCvUseCase = {
  updateCv(input: UpdateCvInput): Promise<void>;
};
