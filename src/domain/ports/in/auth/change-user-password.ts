import z from "zod";

export const changeUserPasswordInputSchema = z.object({
  requestUserId: z.uuidv7(),
  oldPassword: z.string().min(8).max(255),
  newPassword: z.string().min(8).max(255),
  ipAddress: z.string().nullable(),
  userAgent: z.string().max(512).nullable(),
});

export type ChangeUserPasswordInput = z.infer<
  typeof changeUserPasswordInputSchema
>;

export type ChangeUserPasswordUseCase = {
  changeUserPassword(input: ChangeUserPasswordInput): Promise<void>;
};
