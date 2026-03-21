export type IssuedToken = {
  value: string;
  expiresAt: Date;
};

export type TokenPair = {
  accessToken: IssuedToken;
  refreshToken: IssuedToken;
};

export type IssueTokenPairParams = {
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
};

export type RefreshTokenPairParams = {
  refreshToken: string;
  ipAddress: string | null;
  userAgent: string | null;
};

export type TokenPairOptions = {
  rememberMe?: boolean;
};

export type AccessTokenPayload = {
  userId: string;
};

export type TokenProvider = {
  issueTokenPair(
    params: IssueTokenPairParams,
    options?: TokenPairOptions,
  ): Promise<TokenPair>;
  verifyAccessToken(token: string): Promise<AccessTokenPayload | void>;
  refreshTokenPair(
    params: RefreshTokenPairParams,
    options?: TokenPairOptions,
  ): Promise<TokenPair>;
  revokeRefreshToken(refreshToken: string): Promise<void>;
  revokeAllByUserId(userId: string): Promise<void>;
};
