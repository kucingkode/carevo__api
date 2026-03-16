import { proftoDataSchema } from "@/domain/entities/profto";
import z from "zod";

// request
export const updateProftoInputSchema = z.object({
  requestUserId: z.uuidv7(),
  profto: proftoDataSchema,
});

export type UpdateProftoInput = z.infer<typeof updateProftoInputSchema>;

// use case
export type UpdateProftoUseCase = {
  updateProfto(input: UpdateProftoInput): Promise<void>;
};
