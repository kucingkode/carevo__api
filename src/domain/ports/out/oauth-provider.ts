export type OAuthUserInfo = {
  providerId: string;
  email: string;
  isEmailVerified: boolean;
  displayName?: string;
  avatarUrl?: string;
};

export type OAuthProvider = {
  getAuthorizationUrl(state: string): string;
  exchangeCode(code: string): Promise<OAuthUserInfo>;
};
