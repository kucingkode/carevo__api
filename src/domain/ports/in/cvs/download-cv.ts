import z from "zod";

// request
export const downloadCvRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  userId: z.uuidv7(),
  type: z.enum(["draft", "saved"]),
  preview: z.boolean(),
});

export type DownloadCvRequestDto = z.infer<typeof downloadCvRequestDtoSchema>;

// use case
export type DownloadCvUseCase = {
  downloadCv(dto: DownloadCvRequestDto): Promise<Buffer>;
};
