import { EMAIL_TOKEN_TTL, PASSWORD_RESET_TOKEN_TTL } from "@/constants";

export type PasswordTokenProps = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
};

export type CreatePasswordTokenParams = {
  userId: string;
  tokenHash: string;
};

export class PasswordToken {
  public readonly userId: string;
  public readonly tokenHash: string;
  public readonly expiresAt: Date;
  private usedAt: Date | null;
  private readonly createdAt: Date;

  private constructor(data: PasswordTokenProps) {
    this.userId = data.userId;
    this.tokenHash = data.tokenHash;
    this.expiresAt = data.expiresAt;
    this.usedAt = data.usedAt;
    this.createdAt = data.createdAt;
  }

  // ===============================
  // Factory
  // ===============================

  static create(params: CreatePasswordTokenParams) {
    return new PasswordToken({
      userId: params.userId,
      tokenHash: params.tokenHash,
      expiresAt: new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL),
      usedAt: null,
      createdAt: new Date(),
    });
  }

  static rehydrate(data: PasswordTokenProps) {
    return new PasswordToken(data);
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

  toPersistence(): PasswordTokenProps {
    return {
      userId: this.userId,
      tokenHash: this.tokenHash,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
      usedAt: this.usedAt,
    };
  }
}
