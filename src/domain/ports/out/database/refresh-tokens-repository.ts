import type { RefreshToken } from "@/domain/models/refresh-token";
import type { TxContext } from "./database";

export type RefreshTokensRepository<TxCtx extends TxContext<any>> = {
  get(ctx: TxCtx, token: string): Promise<RefreshToken | null>;
  save(ctx: TxCtx, refreshToken: RefreshToken): Promise<void>;
  revokeByToken(ctx: TxCtx, token: string): Promise<void>;
  revokeAllByUserId(ctx: TxCtx, userId: string): Promise<void>;
  deleteExpired(ctx: TxCtx): Promise<void>;
};
