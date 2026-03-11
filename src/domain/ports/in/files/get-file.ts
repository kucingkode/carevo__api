import z from "zod";

// request
export const getFileRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  id: z.string(),
});

export type GetFileRequestDto = z.infer<typeof getFileRequestDtoSchema>;

// use case
export type GetFileUseCase = {
  getFile(dto: GetFileRequestDto): Promise<void>;
};
