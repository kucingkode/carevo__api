import type { BootcampData } from "@/domain/models/bootcamp";
import z from "zod";

// request
export const getBootcampsFeedRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type GetBootcampsFeedRequestDto = z.infer<
  typeof getBootcampsFeedRequestDtoSchema
>;

// response
export type GetBootcampsFeedResponseDto = {
  bootcamps: BootcampData[];
};

// use case
export type GetBootcampsFeedUseCase = {
  getBootcampsFeed(
    dto: GetBootcampsFeedRequestDto,
  ): Promise<GetBootcampsFeedResponseDto>;
};
