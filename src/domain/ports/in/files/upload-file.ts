import z from "zod";

// request
export const uploadFileInputSchema = z.object({
  requestUserId: z.uuidv7(),
  mimeType: z.string(),
  data: z.any(),
});

export type UploadFileInput = z.infer<typeof uploadFileInputSchema>;

// response
export type UploadFileOutput = {
  fileId: string;
};

// use case
export type UploadFileUseCase = {
  uploadFile(input: UploadFileInput): Promise<UploadFileOutput>;
};
