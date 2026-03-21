import type { ProftoProps } from "@/domain/entities/profto";
import z from "zod";

// request
export const getUserProftoInputSchema = z.object({
  username: z.string(),
});

export type GetUserProftoInput = z.infer<typeof getUserProftoInputSchema>;

// response
export type GetUserProftoOutput = {
  profto: ProftoProps;
};

// use case
export type GetUserProftoUseCase = {
  getUserProfto(input: GetUserProftoInput): Promise<GetUserProftoOutput>;
};
