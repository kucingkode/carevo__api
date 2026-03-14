import type { PasswordToken } from "@/domain/models/password-token";

export type PasswordTokensRepository<TxCtx> = {
  getByUserId(ctx: TxCtx, userId: string): Promise<PasswordToken | null>;
  save(ctx: TxCtx, token: PasswordToken): Promise<void>;
};
