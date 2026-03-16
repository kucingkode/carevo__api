import type { Community } from "@/domain/entities/community";
import z from "zod";

// request
export const listCommunitiesInputSchema = z.object({
  query: z.string().max(255).optional(),
  professionRole: z.string().max(255).optional(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type ListCommunitiesInput = z.infer<typeof listCommunitiesInputSchema>;

// response
export type ListCommunitiesOutput = {
  communities: Community[];
};

// use case
export type ListCommunitiesUseCase = {
  listCommunities(input: ListCommunitiesInput): Promise<ListCommunitiesOutput>;
};
