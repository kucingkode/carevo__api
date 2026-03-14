import {
  OUTBOUND_DIRECTION,
  REFRESH_TOKENS_REPOSITORY_PORT,
} from "@/constants";
import type { RefreshToken } from "@/domain/models/refresh-token";
import type { RefreshTokensRepository } from "@/domain/ports/out/database/refresh-tokens-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";
import { refreshTokens } from "../schema";
import { eq, lte } from "drizzle-orm";
import { RefreshTokensRepositoryError } from "@/domain/errors/infrastructure/database-error";
import { NotFoundError } from "@/domain/errors/common";

export class DrizzleRefreshTokensRepository
  extends BaseAdapter
  implements RefreshTokensRepository<DrizzleTxContext>
{
  constructor() {
    super(REFRESH_TOKENS_REPOSITORY_PORT, OUTBOUND_DIRECTION);
  }

  async get(
    ctx: DrizzleTxContext,
    token: string,
  ): Promise<RefreshToken | null> {
    try {
      const [id, _] = token.split(".");
      const result = await ctx.tx.query.refreshTokens.findFirst({
        where: eq(refreshTokens.id, id),
      });

      if (!result) {
        return null;
      }

      return result;
    } catch (err) {
      throw new RefreshTokensRepositoryError("Database query failed", {
        cause: err,
      });
    }
  }

  async deleteExpired(ctx: DrizzleTxContext): Promise<void> {
    try {
      await ctx.tx
        .delete(refreshTokens)
        .where(lte(refreshTokens.expiresAt, new Date()));

      this.log.debug("Expired refresh tokens deleted");
    } catch (err) {
      throw new RefreshTokensRepositoryError("Database query failed", {
        cause: err,
      });
    }
  }

  async revokeAllByUserId(
    ctx: DrizzleTxContext,
    userId: string,
  ): Promise<void> {
    try {
      await ctx.tx
        .delete(refreshTokens)
        .where(eq(refreshTokens.userId, userId));

      this.log.debug({ userId }, "User refresh tokens revoked");
    } catch (err) {
      throw new RefreshTokensRepositoryError("Database query failed", {
        cause: err,
      });
    }
  }

  async revokeByToken(ctx: DrizzleTxContext, token: string): Promise<void> {
    try {
      const [id, _] = token.split(".");
      const result = await ctx.tx
        .delete(refreshTokens)
        .where(eq(refreshTokens.id, id))
        .returning({
          id: refreshTokens.id,
        });

      if (!result.length) {
        throw new NotFoundError();
      }

      this.log.debug({ id }, "Refresh token revoked");
    } catch (err) {
      throw new RefreshTokensRepositoryError("Database query failed", {
        cause: err,
      });
    }
  }

  async save(ctx: DrizzleTxContext, refreshToken: RefreshToken): Promise<void> {
    try {
      await ctx.tx.insert(refreshTokens).values(refreshToken);
      this.log.debug("Refresh token inserted");
    } catch (err) {
      throw new RefreshTokensRepositoryError("Database query failed", {
        cause: err,
      });
    }
  }
}
