import z from "zod";

// request
export const sendPasswordResetEmailInputSchema = z.object({
  email: z.email().max(255),
  ipAddress: z.string().nullable(),
});

export type SendPasswordResetEmailInput = z.infer<
  typeof sendPasswordResetEmailInputSchema
>;

// use case
export type SendPasswordResetEmailUseCase = {
  sendPasswordResetEmail(input: SendPasswordResetEmailInput): Promise<void>;
};
