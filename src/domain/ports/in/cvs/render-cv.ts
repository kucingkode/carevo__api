import z from "zod";

// request
export const renderCvInputSchema = z.object({
  requestUserId: z.uuidv7(),
  userId: z.uuidv7(),
  preview: z.boolean(),
});

export type RenderCvInput = z.infer<typeof renderCvInputSchema>;

// response
export type RenderCvOutput = {
  buffer: Buffer;
};

// use case
export type RenderCvUseCase = {
  renderCv(input: RenderCvInput): Promise<RenderCvOutput>;
};
