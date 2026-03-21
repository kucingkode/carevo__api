import {
  PASSWORD_TOKENS_REPOSITORY_PORT,
  OUTBOUND_DIRECTION,
} from "@/constants";
import type { PasswordTokensRepository } from "@/domain/ports/out/database/password-tokens-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";
import { PasswordToken } from "@/domain/entities/password-token";
import { and, eq, isNull, sql } from "drizzle-orm";
import { passwordTokens } from "../schema";
import { PasswordTokensRepositoryError } from "@/domain/errors/infrastructure-errors";

export class DrizzlePasswordTokensRepository
  extends BaseAdapter
  implements PasswordTokensRepository<DrizzleTxContext>
{
  constructor() {
    super(
      PASSWORD_TOKENS_REPOSITORY_PORT,
      OUTBOUND_DIRECTION,
      PasswordTokensRepositoryError,
    );
  }

  async getByUserId(
    ctx: DrizzleTxContext,
    userId: string,
  ): Promise<PasswordToken | undefined> {
    const result = await ctx.tx.query.passwordTokens.findFirst({
      where: and(
        eq(passwordTokens.userId, userId),
        isNull(passwordTokens.usedAt),
      ),
    });

    if (!result) return;

    return PasswordToken.rehydrate(result);
  }

  async save(ctx: DrizzleTxContext, token: PasswordToken): Promise<void> {
    await ctx.tx
      .insert(passwordTokens)
      .values(token.toPersistence())
      .onConflictDoUpdate({
        target: passwordTokens.userId,
        set: {
          tokenHash: sql`excluded.token_hash`,
          expiresAt: sql`excluded.expires_at`,
          usedAt: sql`excluded.used_at`,
          createdAt: sql`excluded.created_at`,
        },
      });

    this.log.debug({ userId: token.userId }, "Password token upserted");
  }
}
