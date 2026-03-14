import z from "zod";

// request
export const verifyUserEmailInputSchema = z.object({
  email: z.email().max(255),
  token: z.string().length(43),
});

export type VerifyUserEmailInput = z.infer<typeof verifyUserEmailInputSchema>;

// use case
export type VerifyUserEmailUseCase = {
  verifyUserEmail(dto: VerifyUserEmailInput): Promise<void>;
};
