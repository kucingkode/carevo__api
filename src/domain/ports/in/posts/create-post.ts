import z from "zod";

// request
export const createPostInputSchema = z.object({
  requestUserId: z.uuidv7(),
  communityId: z.uuidv7(),
  content: z.string().max(2000),
});

export type CreatePostInput = z.infer<typeof createPostInputSchema>;

// response
export type CreatePostOutput = {
  createdAt: Date;
};

// use case
export type CreatePostUseCase = {
  createPost(input: CreatePostInput): Promise<CreatePostOutput>;
};
