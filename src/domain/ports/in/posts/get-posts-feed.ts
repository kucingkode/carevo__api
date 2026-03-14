import type { PostData } from "@/domain/models/post";
import z from "zod";

// request
export const getPostsFeedInputSchema = z.object({
  requestUserId: z.uuidv7(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type GetPostsFeedInput = z.infer<typeof getPostsFeedInputSchema>;

// response
export type GetPostsFeedOutput = {
  posts: PostData[];
};

// use case
export type GetPostsFeedUseCase = {
  getPostsFeed(input: GetPostsFeedInput): Promise<GetPostsFeedOutput>;
};
