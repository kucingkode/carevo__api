import type { CommunityData } from "@/domain/models/community";
import z from "zod";

// request
export const searchCommunitiesRequestDtoSchema = z.object({
  query: z.string().optional(),
  professionRole: z.string().optional(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type SearchCommunitiesRequestDto = z.infer<
  typeof searchCommunitiesRequestDtoSchema
>;

// response
export type SearchCommunitiesResponseDto = {
  communities: CommunityData[];
};

// use case
export type SearchCommunitiesUseCase = {
  searchCommunitiesFeed(
    dto: SearchCommunitiesRequestDto,
  ): Promise<SearchCommunitiesResponseDto>;
};
