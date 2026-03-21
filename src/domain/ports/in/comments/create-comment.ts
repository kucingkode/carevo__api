import z from "zod";

// request
export const createCommentInputSchema = z.object({
  requestUserId: z.uuidv7(),
  postId: z.uuidv7(),
  parentId: z.uuidv7().optional(),
  content: z.string().max(2000),
});

export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;

// response
export type CreateCommentOutput = {
  commentId: string;
  createdAt: Date;
};

// use case
export type CreateCommentUseCase = {
  createComment(input: CreateCommentInput): Promise<CreateCommentOutput>;
};
