import type { BootcampData } from "@/domain/models/bootcamp";
import z from "zod";

// request
export const listBootcampsRequestDtoSchema = z.object({
  query: z.string().max(255).optional(),
  professionRole: z.string().max(255).optional(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type ListBootcampsRequestDto = z.infer<
  typeof listBootcampsRequestDtoSchema
>;

// responses
export type ListBootcampsResponseDto = {
  bootcamps: BootcampData[];
};

export type ListBootcampsUseCase = {
  listBootcamps(
    dto: ListBootcampsRequestDto,
  ): Promise<ListBootcampsResponseDto>;
};
