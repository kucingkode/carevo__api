import type { ProftoData } from "@/domain/entities/profto";
import z from "zod";

// request
export const getProftoInputSchema = z.object({
  requestUserId: z.uuidv7(),
  userId: z.uuidv7(),
});

export type GetProftoInput = z.infer<typeof getProftoInputSchema>;

// response
export type GetProftoOutput = {
  profto: ProftoData;
};

// use case
export type GetProftoUseCase = {
  getProfto(input: GetProftoInput): Promise<GetProftoOutput>;
};
