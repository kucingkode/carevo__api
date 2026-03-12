import z from "zod";

export const changeUserPasswordRequestDtoSchema = z.object({
  requestUserId: z.uuidv7(),
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export type ChangeUserPasswordRequestDto = z.infer<
  typeof changeUserPasswordRequestDtoSchema
>;

export type ChangeUserPasswordUseCase = {
  changeUserPassword(dto: ChangeUserPasswordRequestDto): Promise<void>;
};
