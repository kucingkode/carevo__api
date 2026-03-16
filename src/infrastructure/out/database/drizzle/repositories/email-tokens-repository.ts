import { EMAIL_TOKENS_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type { EmailTokensRepository } from "@/domain/ports/out/database/email-tokens-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";
import { EmailToken } from "@/domain/entities/email-token";
import { emailTokens } from "../schema";
import { eq, sql } from "drizzle-orm";
import { EmailTokensRepositoryError } from "@/domain/errors/infrastructure/database-error";

export class DrizzleEmailTokensRepository
  extends BaseAdapter
  implements EmailTokensRepository<DrizzleTxContext>
{
  constructor() {
    super(EMAIL_TOKENS_REPOSITORY_PORT, OUTBOUND_DIRECTION);
  }

  async getByUserId(
    ctx: DrizzleTxContext,
    userId: string,
  ): Promise<EmailToken | null> {
    try {
      const result = await ctx.tx.query.emailTokens.findFirst({
        where: eq(emailTokens.userId, userId),
      });

      if (!result) return null;

      return EmailToken.rehydrate(result);
    } catch (err) {
      throw new EmailTokensRepositoryError("Database query failed", {
        cause: err,
      });
    }
  }

  async save(ctx: DrizzleTxContext, token: EmailToken): Promise<void> {
    try {
      await ctx.tx
        .insert(emailTokens)
        .values(token.toPersistence())
        .onConflictDoUpdate({
          target: emailTokens.userId,
          set: {
            tokenHash: sql`excluded.token_hash`,
            expiresAt: sql`excluded.expires_at`,
            usedAt: sql`excluded.used_at`,
            createdAt: sql`excluded.created_at`,
          },
        });
      this.log.debug({ userId: token.userId }, "Password token upserted");
    } catch (err) {
      throw new EmailTokensRepositoryError("Database query failed", {
        cause: err,
      });
    }
  }
}
