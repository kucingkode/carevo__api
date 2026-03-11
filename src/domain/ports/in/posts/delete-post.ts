import z from "zod";

// request
export const deletePostRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  postId: z.uuidv7(),
});

export type DeletePostRequestDto = z.infer<typeof deletePostRequestDtoSchema>;

// use case
export type DeletePostUseCase = {
  deletePost(dto: DeletePostRequestDto): Promise<void>;
};
