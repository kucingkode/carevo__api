import z from "zod";

// request
export const uploadFileRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  mimeType: z.string(),
  data: z.any(),
});

export type UploadFileRequestDto = z.infer<typeof uploadFileRequestDtoSchema>;

// response
export type UploadFileResponseDto = {
  fileId: string;
};

// use case
export type UploadFileUseCase = {
  uploadFile(dto: UploadFileRequestDto): Promise<UploadFileResponseDto>;
};
