import z from "zod";

// request
export const likePostInputSchema = z.object({
  requestUserId: z.uuidv7(),
  postId: z.uuidv7(),
});

export type LikePostInput = z.infer<typeof likePostInputSchema>;

// use case
export type LikePostUseCase = {
  likePost(dto: LikePostInput): Promise<void>;
};
