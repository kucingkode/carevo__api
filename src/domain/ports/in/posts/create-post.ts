import z from "zod";

export const createPostRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  communityId: z.uuidv7(),
  content: z.string(),
});

export type CreatePostRequestDto = z.infer<typeof createPostRequestDtoSchema>;

export type CreatePostUseCase = {
  createPost(dto: CreatePostRequestDto): Promise<void>;
};
