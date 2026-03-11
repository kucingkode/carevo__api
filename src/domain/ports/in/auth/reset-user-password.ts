import z from "zod";

// request
export const resetUserPasswordRequestDtoSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

export type ResetUserPasswordRequestDto = z.infer<
  typeof resetUserPasswordRequestDtoSchema
>;

// use case
export type ResetUserPasswordUseCase = {
  resetUserPassword(dto: ResetUserPasswordRequestDto): Promise<void>;
};
