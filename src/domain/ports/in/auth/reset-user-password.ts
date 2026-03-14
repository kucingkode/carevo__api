import z from "zod";

// request
export const resetUserPasswordInputSchema = z.object({
  token: z.string().length(43),
  newPassword: z.string().min(8).max(255),
});

export type ResetUserPasswordInput = z.infer<
  typeof resetUserPasswordInputSchema
>;

// use case
export type ResetUserPasswordUseCase = {
  resetUserPassword(dto: ResetUserPasswordInput): Promise<void>;
};
