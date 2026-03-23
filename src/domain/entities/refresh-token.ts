export type RefreshToken = {
  id: string;
  userId: string;
  tokenHash: string;
  ipAddress: string | null;
  userAgent: string | null;
  longLived: boolean;
  expiresAt: Date;
  createdAt: Date;
};
