import z from "zod";

// request
export const saveCvInputSchema = z.object({
  requestUserId: z.uuidv7(),
});

export type SaveCvInput = z.infer<typeof saveCvInputSchema>;

// use case
export type SaveCvUseCase = {
  saveCv(input: SaveCvInput): Promise<void>;
};
