import type { ProftoSummary } from "@/domain/models/profto";
import z from "zod";

// request
export const searchProftoRequestDtoSchema = z.object({
  query: z.string(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type SearchProftoRequestDto = z.infer<
  typeof searchProftoRequestDtoSchema
>;

// response
export type SearchProftoResponseDto = {
  proftos: ProftoSummary[];
};

// use case
export type SearchProftoUseCase = {
  searchProfto(dto: SearchProftoRequestDto): Promise<SearchProftoResponseDto>;
};
