import { proftoContentSchema } from "@/domain/models/profto";
import z from "zod";

// request
export const updateProftoRequestDtoSchema = z.object({
  partialContent: proftoContentSchema.partial(),
});

export type UpdateProftoRequestDto = z.infer<
  typeof updateProftoRequestDtoSchema
>;

// use case
export type UpdateProftoUseCase = {
  updateProfto(dto: UpdateProftoRequestDto): Promise<void>;
};
