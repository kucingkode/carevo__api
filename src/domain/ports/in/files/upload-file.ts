import type { PipelineSource } from "node:stream";
import z from "zod";

// request
export const uploadFileInputSchema = z.object({
  requestUserId: z.uuidv7(),
  mimeType: z.string(),
  stream: z.custom<readonly PipelineSource<any>[] | PipelineSource<any>>(),
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
