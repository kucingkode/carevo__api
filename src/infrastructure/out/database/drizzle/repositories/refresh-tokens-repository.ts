import {
  OUTBOUND_DIRECTION,
  REFRESH_TOKENS_REPOSITORY_PORT,
} from "@/constants";
import type { RefreshToken } from "@/domain/entities/refresh-token";
import type { RefreshTokensRepository } from "@/domain/ports/out/database/refresh-tokens-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";
import { refreshTokens } from "../schema";
import { and, eq, isNull, lte } from "drizzle-orm";
import { RefreshTokensRepositoryError } from "@/domain/errors/infrastructure-errors";

export class DrizzleRefreshTokensRepository
  extends BaseAdapter
  implements RefreshTokensRepository<DrizzleTxContext>
{
  constructor() {
    super(
      REFRESH_TOKENS_REPOSITORY_PORT,
      OUTBOUND_DIRECTION,
      RefreshTokensRepositoryError,
    );
  }

  async getById(
    ctx: DrizzleTxContext,
    tokenId: string,
  ): Promise<RefreshToken | undefined> {
    const result = await ctx.tx.query.refreshTokens.findFirst({
      where: and(eq(refreshTokens.id, tokenId)),
    });

    if (!result) {
      return;
    }

    return result;
  }

  async deleteExpired(ctx: DrizzleTxContext): Promise<void> {
    const result = await ctx.tx
      .delete(refreshTokens)
      .where(lte(refreshTokens.expiresAt, new Date()))
      .returning({ id: refreshTokens.id });

    this.log.debug({ count: result.length }, "Expired refresh tokens deleted");
  }

  async revokeAllByUserId(
    ctx: DrizzleTxContext,
    userId: string,
  ): Promise<void> {
    const result = await ctx.tx
      .delete(refreshTokens)
      .where(eq(refreshTokens.userId, userId))
      .returning({
        id: refreshTokens.id,
      });

    this.log.debug(
      { userId, count: result.length },
      "User refresh tokens revoked",
    );
  }

  async revokeById(ctx: DrizzleTxContext, id: string): Promise<void> {
    const result = await ctx.tx
      .delete(refreshTokens)
      .where(eq(refreshTokens.id, id))
      .returning({
        id: refreshTokens.id,
      });

    this.log.debug({ id, count: result.length }, "Refresh token revoked");
  }

  async save(ctx: DrizzleTxContext, refreshToken: RefreshToken): Promise<void> {
    await ctx.tx.insert(refreshTokens).values(refreshToken);
    this.log.debug({ id: refreshToken.id }, "Refresh token inserted");
  }
}
