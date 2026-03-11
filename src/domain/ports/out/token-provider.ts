export type TokenPair = {
  accessToken?: string;
  refreshToken?: string;
};

export type TokenProvider = {
  issueTokenPair(userId: string): Promise<TokenPair>;
  verifyAccessToken(token: string): Promise<string>;
  renewTokenPair(refreshToken: string): Promise<TokenPair>;
  revokeRefreshToken(refreshToken: string): Promise<void>;
  revokeAllByUserId(userId: string): Promise<void>;
};
