import type { PostData } from "@/domain/models/post";
import z from "zod";

// request
export const getPostsFeedRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type GetPostsFeedRequestDto = z.infer<
  typeof getPostsFeedRequestDtoSchema
>;

// response
export type GetPostsFeedResponseDto = {
  posts: PostData[];
};

// use case
export type GetPostsFeedUseCase = {
  getPostsFeed(dto: GetPostsFeedRequestDto): Promise<GetPostsFeedResponseDto>;
};
