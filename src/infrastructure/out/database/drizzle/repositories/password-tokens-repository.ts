import {
  PASSWORD_TOKENS_REPOSITORY_PORT,
  OUTBOUND_DIRECTION,
} from "@/constants";
import type { PasswordTokensRepository } from "@/domain/ports/out/database/password-tokens-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";
import type { PasswordToken } from "@/domain/models/password-token";
import { PasswordTokensRepositoryError } from "@/domain/errors/infrastructure/database-error";
import { eq } from "drizzle-orm";
import { passwordTokens } from "../schema";

export class DrizzlePasswordTokensRepository
  extends BaseAdapter
  implements PasswordTokensRepository<DrizzleTxContext>
{
  constructor() {
    super(PASSWORD_TOKENS_REPOSITORY_PORT, OUTBOUND_DIRECTION);
  }

  async getByUserId(
    ctx: DrizzleTxContext,
    userId: string,
  ): Promise<PasswordToken | null> {
    try {
      const result = await ctx.tx.query.passwordTokens.findFirst({
        where: eq(passwordTokens.userId, userId),
      });

      if (!result) return null;

      return result;
    } catch (err) {
      throw new PasswordTokensRepositoryError("Database query failed", {
        cause: err,
      });
    }
  }

  async save(ctx: DrizzleTxContext, token: PasswordToken): Promise<void> {
    try {
      await ctx.tx
        .insert(passwordTokens)
        .values(token)
        .onConflictDoUpdate({
          target: passwordTokens.userId,
          set: {
            tokenHash: token.tokenHash,
            expiresAt: token.expiresAt,
            usedAt: token.usedAt,
            createdAt: token.createdAt,
          },
        });
      this.log.debug({ userId: token.userId }, "Password token upserted");
    } catch (err) {
      throw new PasswordTokensRepositoryError("Database query failed", {
        cause: err,
      });
    }
  }
}
