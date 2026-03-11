import type { BootcampData } from "@/domain/models/bootcamp";
import z from "zod";

// request
export const searchBootcampsRequestDtoSchema = z.object({
  query: z.string().optional(),
  professionalRole: z.string().optional(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type SearchBootcampsRequestDto = z.infer<
  typeof searchBootcampsRequestDtoSchema
>;

// responses
export type SearchBootcampsResponseDto = {
  bootcamps: BootcampData[];
};

export type SearchBootcampsUseCase = {
  searchBootcamps(
    dto: SearchBootcampsRequestDto,
  ): Promise<SearchBootcampsResponseDto>;
};
