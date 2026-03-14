import type { CvData } from "@/domain/models/cv";
import z from "zod";

// request
export const getCvInputSchema = z.object({
  requestUserId: z.uuidv7(),
});

export type GetCvInput = z.infer<typeof getCvInputSchema>;

// response
export type GetCvOutput = {
  cv: CvData;
};

// use case
export type GetCvUseCase = {
  getCv(input: GetCvInput): Promise<GetCvOutput>;
};
