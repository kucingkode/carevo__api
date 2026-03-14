import z from "zod";

// request
export const getFileInputSchema = z.object({
  requestUserId: z.uuidv7(),
  fileId: z.uuidv7(),
});

export type GetFileInput = z.infer<typeof getFileInputSchema>;

// response
export type GetFileOutput = {
  data: Buffer;
  mimeType: string;
};

// use case
export type GetFileUseCase = {
  getFile(dto: GetFileInput): Promise<GetFileOutput>;
};
