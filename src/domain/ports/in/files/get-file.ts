import z from "zod";

// request
export const getFileRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  fileId: z.uuidv7(),
});

export type GetFileRequestDto = z.infer<typeof getFileRequestDtoSchema>;

// response
export type GetFileResponseDto = {
  data: Buffer;
  mimeType: string;
};

// use case
export type GetFileUseCase = {
  getFile(dto: GetFileRequestDto): Promise<GetFileResponseDto>;
};
