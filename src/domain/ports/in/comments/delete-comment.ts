import z from "zod";

// request
export const deleteCommentInputSchema = z.object({
  requestUserId: z.string(),
  commentId: z.uuidv7(),
  postId: z.uuidv7(),
});

export type DeleteCommentInput = z.infer<typeof deleteCommentInputSchema>;

// use case
export type DeleteCommentUseCase = {
  deleteComment(input: DeleteCommentInput): Promise<void>;
};
