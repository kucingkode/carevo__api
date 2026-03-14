import z from "zod";

// request
export const refreshUserTokenInputSchema = z.object({
  refreshToken: z.string().length(43),
  rememberMe: z.boolean(),
  ipAddress: z.ipv4(),
  userAgent: z.string().max(512),
});

export type RefreshUserTokenInput = z.infer<typeof refreshUserTokenInputSchema>;

// response
export type RefreshUserTokenOutput = {
  accessToken: string;
  refreshToken: string;
};

// use case
export type RefreshUserTokenUseCase = {
  refreshUserToken(
    input: RefreshUserTokenInput,
  ): Promise<RefreshUserTokenOutput>;
};
