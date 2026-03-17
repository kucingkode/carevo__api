import z from "zod";

// request
export const googleOauthInputSchema = z.object({
  email: z.email().max(255),
  emailVerified: z.boolean(),
  name: z.string(),
  googleId: z.string(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().max(512).nullable(),
});

export type GoogleOauthInput = z.infer<typeof googleOauthInputSchema>;

// response
export type GoogleOauthOutput = {
  userId: string;
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
};

// use case
export type GoogleOauthUseCase = {
  googleOauth(input: GoogleOauthInput): Promise<GoogleOauthOutput>;
};
