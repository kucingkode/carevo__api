export type IssuedToken = {
  value: string;
  expiresAt: Date;
};

export type TokenPair = {
  accessTokenIssued: IssuedToken;
  refreshTokenIssued: IssuedToken;
  longLived: boolean;
};

export type IssueTokenPairParams = {
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
};

export type RefreshTokenPairParams = {
  refreshTokenStr: string;
  ipAddress: string | null;
  userAgent: string | null;
};

export type TokenPairOptions = {
  longLived?: boolean;
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
  refreshTokenPair(params: RefreshTokenPairParams): Promise<TokenPair>;
  revokeRefreshToken(refreshTokenStr: string): Promise<void>;
  revokeAllByUserId(userId: string): Promise<void>;
};
