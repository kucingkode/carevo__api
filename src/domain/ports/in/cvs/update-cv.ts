import { cvContentSchema } from "@/domain/models/cv";
import z from "zod";

// request
export const updateCvRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  partialContent: cvContentSchema.partial(),
});

export type UpdateCvRequestDto = z.infer<typeof updateCvRequestDtoSchema>;

// use case
export type UpdateCvUseCase = {
  updateCv(dto: UpdateCvRequestDto): Promise<void>;
};
