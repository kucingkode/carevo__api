import z from "zod";
import type { TokenPair } from "../../out/token-provider";

// request
export const refreshUserTokenInputSchema = z.object({
  refreshToken: z.string().length(80),
  rememberMe: z.boolean(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().max(512).nullable(),
});

export type RefreshUserTokenInput = z.infer<typeof refreshUserTokenInputSchema>;

// response
export type RefreshUserTokenOutput = {
  accessToken: string;
  accessTokenExpiredAt: Date;
  refreshToken: string;
  refreshTokenExpiredAt: Date;
};

// use case
export type RefreshUserTokenUseCase = {
  refreshUserToken(
    input: RefreshUserTokenInput,
  ): Promise<RefreshUserTokenOutput>;
};
