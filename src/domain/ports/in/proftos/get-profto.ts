import type { ProftoContent } from "@/domain/models/profto";
import z from "zod";

// request
export const getProftoRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  userId: z.uuidv7(),
});

export type GetProftoRequestDto = z.infer<typeof getProftoRequestDtoSchema>;

// response
export type GetProftoResponseDto = {
  userId: string;
  username: string;
  content: ProftoContent;
};

// use case
export type GetProftoUseCase = {
  getProfto(dto: GetProftoRequestDto): Promise<GetProftoResponseDto>;
};
