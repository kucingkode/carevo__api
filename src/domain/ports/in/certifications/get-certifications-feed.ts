import type { CertificationData } from "@/domain/models/certification";
import z from "zod";

// request
export const getCertificationsFeedRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type GetCertificationsFeedRequestDto = z.infer<
  typeof getCertificationsFeedRequestDtoSchema
>;

// response
export type GetCertificationsFeedResponseDto = {
  bcertifications: CertificationData[];
};

// use case
export type GetCertificationsFeedUseCase = {
  getCertificationsFeed(
    dto: GetCertificationsFeedRequestDto,
  ): Promise<GetCertificationsFeedResponseDto>;
};
