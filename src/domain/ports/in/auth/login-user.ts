import z from "zod";

// request
export const loginUserPasswordRequestDtoSchema = z.object({
  email: z.email().max(255),
  password: z.string().min(8).max(255),
  ipAddress: z.ipv4(),
  userAgent: z.string().max(512),
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
