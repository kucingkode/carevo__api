import type { Certification } from "@/domain/entities/certification";
import z from "zod";

// request
export const listCertificationsInputSchema = z.object({
  query: z.string().max(255).optional(),
  professionRole: z.string().max(255).optional(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type ListCertificationsInput = z.infer<
  typeof listCertificationsInputSchema
>;

// response
export type ListCertificationsOutput = {
  certifications: Certification[];
};

// use case
export type ListCertificationsUseCase = {
  listCertifications(
    input: ListCertificationsInput,
  ): Promise<ListCertificationsOutput>;
};
