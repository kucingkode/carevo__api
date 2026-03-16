import z from "zod";
import type { TokenPair } from "../../out/token-provider";

// request
export const loginUserInputSchema = z.object({
  email: z.email().max(255),
  password: z.string().min(8).max(255),
  rememberMe: z.boolean(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().max(512).nullable(),
});

export type LoginUserInput = z.infer<typeof loginUserInputSchema>;

// response
export type LoginUserOutput = {
  userId: string;
  accessToken: string;
  accessTokenExpiredAt: Date;
  refreshToken: string;
  refreshTokenExpiredAt: Date;
};

// use case
export type LoginUserUseCase = {
  loginUser(input: LoginUserInput): Promise<LoginUserOutput>;
};
