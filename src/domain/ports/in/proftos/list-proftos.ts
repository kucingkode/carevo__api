import type { ProftoSummary } from "@/domain/entities/profto";
import z from "zod";

// request
export const listProftosInputSchema = z.object({
  query: z.string().max(255),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type ListProftosInput = z.infer<typeof listProftosInputSchema>;

// response
export type ListProftosOutput = {
  proftos: ProftoSummary[];
};

// use case
export type ListProftosUseCase = {
  listProftos(input: ListProftosInput): Promise<ListProftosOutput>;
};
