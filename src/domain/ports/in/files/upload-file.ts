import z from "zod";

// request
export const uploadFileRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  data: z.any(),
  mimeType: z.string(),
});

export type UploadFileRequestDto = z.infer<typeof uploadFileRequestDtoSchema>;

// response
export type UploadFileResponseDto = {
  id: string;
};

// use case
export type UploadFileUseCase = {
  uploadFile(dto: UploadFileRequestDto): Promise<UploadFileResponseDto>;
};
