import type { Certification } from "@/domain/entities/certification";
import z from "zod";

// request
export const getCertificationsFeedInputSchema = z.object({
  requestUserId: z.uuidv7(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type GetCertificationsFeedInput = z.infer<
  typeof getCertificationsFeedInputSchema
>;

// response
export type GetCertificationsFeedOutput = {
  bcertifications: Certification[];
};

// use case
export type GetCertificationsFeedUseCase = {
  getCertificationsFeed(
    input: GetCertificationsFeedInput,
  ): Promise<GetCertificationsFeedOutput>;
};
