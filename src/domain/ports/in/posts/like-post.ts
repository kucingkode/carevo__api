import z from "zod";

// request
export const likePostRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  postId: z.uuidv7(),
});

export type LikePostRequestDto = z.infer<typeof likePostRequestDtoSchema>;

// use case
export type LikePostUseCase = {
  likePost(dto: LikePostRequestDto): Promise<void>;
};
