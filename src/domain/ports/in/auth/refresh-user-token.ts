import z from "zod";

// request
export const refreshUserTokenInputSchema = z.object({
  refreshToken: z.string().length(80),
  ipAddress: z.string().nullable(),
  userAgent: z.string().max(512).nullable(),
});

export type RefreshUserTokenInput = z.infer<typeof refreshUserTokenInputSchema>;

// response
export type RefreshUserTokenOutput = {
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  rememberMe: boolean;
};

// use case
export type RefreshUserTokenUseCase = {
  refreshUserToken(
    input: RefreshUserTokenInput,
  ): Promise<RefreshUserTokenOutput>;
};
