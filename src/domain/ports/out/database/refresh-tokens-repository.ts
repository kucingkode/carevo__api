import type { RefreshToken } from "@/domain/entities/refresh-token";
import type { TxContext } from "./database";

export type RefreshTokensRepository<TxCtx extends TxContext<any>> = {
  getById(ctx: TxCtx, token: string): Promise<RefreshToken | undefined>;
  save(ctx: TxCtx, refreshToken: RefreshToken): Promise<void>;
  revokeById(ctx: TxCtx, token: string): Promise<void>;
  revokeAllByUserId(ctx: TxCtx, userId: string): Promise<void>;
  deleteExpired(ctx: TxCtx): Promise<void>;
};
