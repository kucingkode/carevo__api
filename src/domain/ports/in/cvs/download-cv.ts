import z from "zod";

// request
export const downloadCvInputSchema = z.object({
  requestUserId: z.uuidv7(),
  userId: z.uuidv7(),
  type: z.enum(["draft", "saved"]),
  preview: z.boolean(),
});

export type DownloadCvInput = z.infer<typeof downloadCvInputSchema>;

// response
export type DownloadCvOutput = {
  file: Buffer;
};

// use case
export type DownloadCvUseCase = {
  downloadCv(dto: DownloadCvInput): Promise<DownloadCvOutput>;
};
