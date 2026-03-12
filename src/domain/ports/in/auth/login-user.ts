import z from "zod";

// request
export const loginUserPasswordRequestDtoSchema = z.object({
  email: z.email().max(255),
  password: z.string().min(8),
});

export type LoginUserPasswordRequestDto = z.infer<
  typeof loginUserPasswordRequestDtoSchema
>;

// response
export type LoginUserPasswordResponseDto = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};

// use case
export type LoginUserPasswordUseCase = {
  loginUserPassword(
    dto: LoginUserPasswordRequestDto,
  ): Promise<LoginUserPasswordResponseDto>;
};
