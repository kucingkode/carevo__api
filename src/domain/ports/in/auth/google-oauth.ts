import z from "zod";

// request
export const googleOauthInputSchema = z.object({
  email: z.email().max(255),
  username: z.string(),
  googleId: z.string().min(8).max(255),
  ipAddress: z.string().nullable(),
  userAgent: z.string().max(512).nullable(),
});

export type GoogleOauthInput = z.infer<typeof googleOauthInputSchema>;

// response
export type GoogleOauthOutput = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};

// use case
export type GoogleOauthUseCase = {
  googleOauth(input: GoogleOauthInput): Promise<GoogleOauthOutput>;
};
