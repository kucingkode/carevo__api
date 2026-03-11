import type { CertificationData } from "@/domain/models/certification";
import z from "zod";

// request
export const searchCertificationsRequestDtoSchema = z.object({
  query: z.string().optional(),
  professionalRole: z.string().optional(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type SearchCertificationsRequestDto = z.infer<
  typeof searchCertificationsRequestDtoSchema
>;

// response
export type SearchCertificationsResponseDto = {
  certifications: CertificationData[];
};

// use case
export type SearchCertificationsUseCase = {
  searchCertifications(
    dto: SearchCertificationsRequestDto,
  ): Promise<SearchCertificationsResponseDto>;
};
