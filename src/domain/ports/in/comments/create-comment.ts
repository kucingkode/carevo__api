import z from "zod";

// request
export const createCommentInput = z.object({
  requestUserId: z.uuidv7(),
  userId: z.uuidv7(),
  postId: z.uuidv7(),
  parrentId: z.uuidv7().optional(),
  content: z.string().max(2000),
});

export type CreateCommentInput = z.infer<typeof createCommentInput>;

// response
export type CreateCommentOutput = {
  createdAt: Date;
};

// use case
export type CreateCommentUseCase = {
  createComment(input: CreateCommentInput): Promise<CreateCommentOutput>;
};
