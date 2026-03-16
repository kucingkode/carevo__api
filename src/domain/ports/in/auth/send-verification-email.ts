import z from "zod";

// request
export const sendVerificationEmailInputSchema = z.object({
  email: z.email().max(255),
  ipAddress: z.string().nullable(),
});

export type SendVerificationEmailInput = z.infer<
  typeof sendVerificationEmailInputSchema
>;

// use case
export type SendVerificationEmailUseCase = {
  sendVerificationEmail(input: SendVerificationEmailInput): Promise<void>;
};
