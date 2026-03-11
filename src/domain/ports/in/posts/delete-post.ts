import z from "zod";

export const deletePostRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  postId: z.uuidv7(),
});

export type DeletePostRequestDto = z.infer<typeof deletePostRequestDtoSchema>;

export type DeletePostUseCase = {
  deletePost(dto: DeletePostRequestDto): Promise<void>;
};
