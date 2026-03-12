import z from "zod";

// request
export const createPostRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  communityId: z.uuidv7(),
  content: z.string().max(2000),
});

export type CreatePostRequestDto = z.infer<typeof createPostRequestDtoSchema>;

// use case
export type CreatePostUseCase = {
  createPost(dto: CreatePostRequestDto): Promise<void>;
};
