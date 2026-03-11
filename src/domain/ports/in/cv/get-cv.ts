import z from "zod";

// request
export const getCvRequestDto = z.object({
  requestUserId: z.uuidv7(),
  userId: z.uuidv7(),
});

// use case
export type GetCvUseCase = {
  getCv(): Promise<void>;
};
