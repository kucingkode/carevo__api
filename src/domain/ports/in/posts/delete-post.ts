import z from "zod";

// request
export const deletePostInputSchema = z.object({
  requestUserId: z.uuidv7(),
  postId: z.uuidv7(),
});

export type DeletePostInput = z.infer<typeof deletePostInputSchema>;

// use case
export type DeletePostUseCase = {
  deletePost(input: DeletePostInput): Promise<void>;
};
