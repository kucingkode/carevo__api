import type { CommunityData } from "@/domain/models/community";
import z from "zod";

// request
export const getCommunitiesFeedInputSchema = z.object({
  requestUserId: z.uuidv7(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type GetCommunitiesFeedInput = z.infer<
  typeof getCommunitiesFeedInputSchema
>;

// response
export type GetCommunitiesFeedOutput = {
  posts: CommunityData[];
};

// use case
export type GetCommunitiesFeedUseCase = {
  getCommunitiesFeed(
    dto: GetCommunitiesFeedInput,
  ): Promise<GetCommunitiesFeedOutput>;
};
