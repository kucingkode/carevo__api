import z from "zod";

// request
export const logoutUserPasswordRequestDtoSchema = z.object({
  refreshToken: z.string().length(43),
});

export type LogoutUserPasswordRequestDto = z.infer<
  typeof logoutUserPasswordRequestDtoSchema
>;

// use case
export type LogoutUserPasswordUseCase = {
  logoutUserPassword(dto: LogoutUserPasswordRequestDto): Promise<void>;
};
