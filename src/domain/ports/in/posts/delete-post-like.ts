import z from "zod";

// request
export const deletePostLikeRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  postId: z.uuidv7(),
});

export type DeletePostLikeRequestDto = z.infer<
  typeof deletePostLikeRequestDtoSchema
>;

// use case
export type DeletePostLikeUseCase = {
  deletePostLike(dto: DeletePostLikeRequestDto): Promise<void>;
};
