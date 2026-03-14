import type { Bootcamp } from "@/domain/models/bootcamp";
import z from "zod";

// request
export const listBootcampsInputSchema = z.object({
  query: z.string().max(255).optional(),
  professionRole: z.string().max(255).optional(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type ListBootcampsInput = z.infer<typeof listBootcampsInputSchema>;

// responses
export type ListBootcampsOutput = {
  bootcamps: Bootcamp[];
};

export type ListBootcampsUseCase = {
  listBootcamps(input: ListBootcampsInput): Promise<ListBootcampsOutput>;
};
