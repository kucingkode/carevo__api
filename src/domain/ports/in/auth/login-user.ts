import z from "zod";

// request
export const loginUserInputSchema = z.object({
  email: z.email().max(255),
  password: z.string().min(8).max(255),
  rememberMe: z.boolean(),
  ipAddress: z.ipv4(),
  userAgent: z.string().max(512),
});

export type LoginUserInput = z.infer<typeof loginUserInputSchema>;

// response
export type LoginUserOutput = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};

// use case
export type LoginUserUseCase = {
  loginUser(dto: LoginUserInput): Promise<LoginUserOutput>;
};
