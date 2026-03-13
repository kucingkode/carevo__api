import z from "zod";

// request
export const refreshTokenRequestDtoSchema = z.object({
  refreshToken: z.string().length(43),
  ipAddress: z.ipv4(),
  userAgent: z.string().max(512),
});

export type RefreshTokenRequestDto = z.infer<
  typeof refreshTokenRequestDtoSchema
>;

// response
export type RefreshTokenResponseDto = {
  accessToken: string;
  refreshToken: string;
};

// use case
export type RefreshTokenUseCase = {
  refreshToken(dto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto>;
};
