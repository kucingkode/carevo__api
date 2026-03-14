import z from "zod";

// request
export const deletePostLikeInputSchema = z.object({
  requestUserId: z.uuidv7(),
  postId: z.uuidv7(),
});

export type DeletePostLikeInput = z.infer<typeof deletePostLikeInputSchema>;

// use case
export type DeletePostLikeUseCase = {
  deletePostLike(input: DeletePostLikeInput): Promise<void>;
};
