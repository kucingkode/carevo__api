import { proftoDataSchema } from "@/domain/models/profto";
import z from "zod";

// request
export const updateProftoRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  profto: proftoDataSchema,
});

export type UpdateProftoRequestDto = z.infer<
  typeof updateProftoRequestDtoSchema
>;

// use case
export type UpdateProftoUseCase = {
  updateProfto(dto: UpdateProftoRequestDto): Promise<void>;
};
