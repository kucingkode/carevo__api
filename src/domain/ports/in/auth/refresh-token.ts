import z from "zod";

// request
export const refreshTokenRequestDtoSchema = z.object({
  refreshToken: z.string(),
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
