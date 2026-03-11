import z from "zod";

// request
export const saveCvRequestDtoSchema = z.object({
  requestUserId: z.string(),
});

export type SaveCvRequestDto = z.infer<typeof saveCvRequestDtoSchema>;

// use case
export type SaveCvUseCase = {
  saveCv(dto: SaveCvRequestDto): Promise<void>;
};
