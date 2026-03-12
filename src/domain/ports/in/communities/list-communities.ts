import type { CommunityData } from "@/domain/models/community";
import z from "zod";

// request
export const listCommunitiesRequestDtoSchema = z.object({
  query: z.string().max(255).optional(),
  professionRole: z.string().max(255).optional(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type ListCommunitiesRequestDto = z.infer<
  typeof listCommunitiesRequestDtoSchema
>;

// response
export type ListCommunitiesResponseDto = {
  communities: CommunityData[];
};

// use case
export type ListCommunitiesUseCase = {
  listCommunitiesFeed(
    dto: ListCommunitiesRequestDto,
  ): Promise<ListCommunitiesResponseDto>;
};
