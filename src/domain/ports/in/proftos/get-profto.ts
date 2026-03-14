import type { ProftoData } from "@/domain/models/profto";
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
  getProfto(dto: GetProftoInput): Promise<GetProftoOutput>;
};
