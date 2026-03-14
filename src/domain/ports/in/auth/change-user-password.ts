import z from "zod";

export const changeUserPasswordInputSchema = z.object({
  requestUserId: z.uuidv7(),
  oldPassword: z.string().min(8).max(255),
  newPassword: z.string().min(8).max(255),
});

export type ChangeUserPasswordInput = z.infer<
  typeof changeUserPasswordInputSchema
>;

export type ChangeUserPasswordUseCase = {
  changeUserPassword(dto: ChangeUserPasswordInput): Promise<void>;
};
