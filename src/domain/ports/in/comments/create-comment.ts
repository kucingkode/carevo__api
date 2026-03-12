import z from "zod";

// request
export const createCommentRequestDto = z.object({
  requestUserId: z.uuidv7(),
  userId: z.uuidv7(),
  postId: z.uuidv7(),
  parrentId: z.uuidv7().optional(),
  content: z.string().max(2000),
});

export type CreateCommentRequestDto = z.infer<typeof createCommentRequestDto>;

// response
export type CreateCommentResponseDto = {
  commentId: string;
};

// use case
export type CreateCommentUseCase = {
  createComment(dto: CreateCommentRequestDto): Promise<void>;
};
