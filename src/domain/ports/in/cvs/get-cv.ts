import type { CvData } from "@/domain/models/cv";
import z from "zod";

// request
export const getCvRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
});

export type GetCvRequestDto = z.infer<typeof getCvRequestDtoSchema>;

// response
export type GetCvResponseDto = {
  cv: CvData;
};

// use case
export type GetCvUseCase = {
  getCv(dto: GetCvRequestDto): Promise<void>;
};
