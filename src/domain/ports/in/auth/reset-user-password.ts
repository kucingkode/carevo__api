import z from "zod";

// request
export const resetUserPasswordInputSchema = z.object({
  token: z.string().length(80),
  newPassword: z.string().min(8).max(255),
  ipAddress: z.string().nullable(),
  userAgent: z.string().max(512).nullable(),
});

export type ResetUserPasswordInput = z.infer<
  typeof resetUserPasswordInputSchema
>;

// use case
export type ResetUserPasswordUseCase = {
  resetUserPassword(input: ResetUserPasswordInput): Promise<void>;
};
