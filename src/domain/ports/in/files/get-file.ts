import type { Readable } from "node:stream";
import z from "zod";

// request
export const getFileInputSchema = z.object({
  requestUserId: z.uuidv7(),
  fileId: z.uuidv7(),
});

export type GetFileInput = z.infer<typeof getFileInputSchema>;

// response
export type GetFileOutput = {
  stream: Readable;
  mimeType: string;
};

// use case
export type GetFileUseCase = {
  getFile(input: GetFileInput): Promise<GetFileOutput>;
};
