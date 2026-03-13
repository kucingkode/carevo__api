import z from "zod";

// request
export const resetUserPasswordRequestDtoSchema = z.object({
  token: z.string().length(43),
  newPassword: z.string().min(8).max(255),
});

export type ResetUserPasswordRequestDto = z.infer<
  typeof resetUserPasswordRequestDtoSchema
>;

// use case
export type ResetUserPasswordUseCase = {
  resetUserPassword(dto: ResetUserPasswordRequestDto): Promise<void>;
};
