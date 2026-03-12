import type { CommunityData } from "@/domain/models/community";
import z from "zod";

// request
export const getCommunitiesFeedRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type GetCommunitiesFeedRequestDto = z.infer<
  typeof getCommunitiesFeedRequestDtoSchema
>;

// response
export type GetCommunitiesFeedResponseDto = {
  posts: CommunityData[];
};

// use case
export type GetCommunitysFeedUseCase = {
  getCommunitysFeed(
    dto: GetCommunitiesFeedRequestDto,
  ): Promise<GetCommunitiesFeedResponseDto>;
};
