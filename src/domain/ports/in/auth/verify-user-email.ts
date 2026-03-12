import z from "zod";

// request
export const verifyEmailRequestDtoSchema = z.object({
  email: z.email().max(255),
  token: z.string(),
});

export type VerifyEmailRequestDto = z.infer<typeof verifyEmailRequestDtoSchema>;

// use case
export type VerifyEmailUseCase = {
  verifyEmail(dto: VerifyEmailRequestDto): Promise<void>;
};
