import z from "zod";

// request
export const verifyUserEmailInputSchema = z.object({
  token: z.string().length(80),
  ipAddress: z.string().nullable(),
});

export type VerifyUserEmailInput = z.infer<typeof verifyUserEmailInputSchema>;

// use case
export type VerifyUserEmailUseCase = {
  verifyUserEmail(input: VerifyUserEmailInput): Promise<void>;
};
