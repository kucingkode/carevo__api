import { proftoPartialUpdateSchema } from "@/domain/entities/profto";
import z from "zod";

// request
export const updateUserProftoInputSchema = z.object({
  requestUserId: z.uuidv7(),
  userId: z.uuidv7(),
  profto: proftoPartialUpdateSchema,
});

export type UpdateUserProftoInput = z.infer<typeof updateUserProftoInputSchema>;

// use case
export type UpdateUserProftoUseCase = {
  updateUserProfto(input: UpdateUserProftoInput): Promise<void>;
};
