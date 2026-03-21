import type { PasswordToken } from "@/domain/entities/password-token";

export type PasswordTokensRepository<TxCtx> = {
  getByUserId(ctx: TxCtx, userId: string): Promise<PasswordToken | undefined>;
  save(ctx: TxCtx, token: PasswordToken): Promise<void>;
};
