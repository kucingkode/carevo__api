import type { Bootcamp } from "@/domain/models/bootcamp";
import z from "zod";

// request
export const getBootcampsFeedInputSchema = z.object({
  requestUserId: z.uuidv7(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type GetBootcampsFeedInput = z.infer<typeof getBootcampsFeedInputSchema>;

// response
export type GetBootcampsFeedOutput = {
  bootcamps: Bootcamp[];
};

// use case
export type GetBootcampsFeedUseCase = {
  getBootcampsFeed(
    input: GetBootcampsFeedInput,
  ): Promise<GetBootcampsFeedOutput>;
};
