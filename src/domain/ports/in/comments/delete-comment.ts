import z from "zod";

// request
export const deleteCommentInput = z.object({
  requestUserId: z.string(),
  commentId: z.uuidv7(),
});

export type DeleteCommentInput = z.infer<typeof deleteCommentInput>;

// use case
export type DeleteCommentUseCase = {
  deleteComment(dto: DeleteCommentInput): Promise<void>;
};
