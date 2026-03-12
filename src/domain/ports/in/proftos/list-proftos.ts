import type { ProftoSummary } from "@/domain/models/profto";
import z from "zod";

// request
export const listProftoRequestDtoSchema = z.object({
  query: z.string().max(255),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type ListProftoRequestDto = z.infer<typeof listProftoRequestDtoSchema>;

// response
export type ListProftoResponseDto = {
  proftos: ProftoSummary[];
};

// use case
export type ListProftoUseCase = {
  listProfto(dto: ListProftoRequestDto): Promise<ListProftoResponseDto>;
};
