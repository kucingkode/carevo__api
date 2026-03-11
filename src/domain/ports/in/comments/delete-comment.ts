import z from "zod";

// request
export const deleteCommentRequestDto = z.object({
  requestUserId: z.string(),
  commentId: z.uuidv7(),
});

export type DeleteCommentRequestDto = z.infer<typeof deleteCommentRequestDto>;

// use case
export type DeleteCommentUseCase = {
  deleteComment(dto: DeleteCommentRequestDto): Promise<void>;
};
