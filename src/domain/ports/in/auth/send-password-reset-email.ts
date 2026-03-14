import z from "zod";

// request
export const sendPasswordResetEmailInputSchema = z.object({
  email: z.email().max(255),
});

export type SendPasswordResetEmailInput = z.infer<
  typeof sendPasswordResetEmailInputSchema
>;

// use case
export type SendPasswordResetEmailUseCase = {
  sendPasswordResetEmail(dto: SendPasswordResetEmailInput): Promise<void>;
};
