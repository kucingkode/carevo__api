import { EMAIL_TOKEN_TTL } from "@/constants";

export type EmailTokenProps = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
};

export type CreateEmailTokenParams = {
  userId: string;
  tokenHash: string;
};

export class EmailToken {
  public readonly userId: string;
  public readonly tokenHash: string;
  public readonly expiresAt: Date;
  private usedAt: Date | null;
  private readonly createdAt: Date;

  private constructor(data: EmailTokenProps) {
    this.userId = data.userId;
    this.tokenHash = data.tokenHash;
    this.expiresAt = data.expiresAt;
    this.usedAt = data.usedAt;
    this.createdAt = data.createdAt;
  }

  // ===============================
  // Factory
  // ===============================

  static create(params: CreateEmailTokenParams) {
    return new EmailToken({
      userId: params.userId,
      tokenHash: params.tokenHash,
      expiresAt: new Date(Date.now() + EMAIL_TOKEN_TTL),
      usedAt: null,
      createdAt: new Date(),
    });
  }

  static rehydrate(data: EmailTokenProps) {
    return new EmailToken(data);
  }

  // ===============================
  // Domain
  // ===============================

  use() {
    this.usedAt = new Date();
  }

  // ===============================
  // Persistence
  // ===============================

  toPersistence(): EmailTokenProps {
    return {
      userId: this.userId,
      tokenHash: this.tokenHash,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
      usedAt: this.usedAt,
    };
  }
}
