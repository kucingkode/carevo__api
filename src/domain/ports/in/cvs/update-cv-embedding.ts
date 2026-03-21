import z from "zod";

// input
export const updateCvEmbeddingInputSchema = z.object({
  userId: z.uuidv7(),
});

export type UpdateCvEmbeddingInput = z.infer<
  typeof updateCvEmbeddingInputSchema
>;

export type UpdateCvEmbeddingUseCase = {
  updateCvEmbedding(input: UpdateCvEmbeddingInput): Promise<void>;
};
