import { EMAIL_TOKENS_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type { EmailTokensRepository } from "@/domain/ports/out/database/email-tokens-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";
import { EmailToken } from "@/domain/entities/email-token";
import { emailTokens } from "../schema";
import { and, eq, isNull, sql } from "drizzle-orm";
import { EmailTokensRepositoryError } from "@/domain/errors/infrastructure-errors";
export class DrizzleEmailTokensRepository
  extends BaseAdapter
  implements EmailTokensRepository<DrizzleTxContext>
{
  constructor() {
    super(
      EMAIL_TOKENS_REPOSITORY_PORT,
      OUTBOUND_DIRECTION,
      EmailTokensRepositoryError,
    );
  }

  async getByUserId(
    ctx: DrizzleTxContext,
    userId: string,
  ): Promise<EmailToken | undefined> {
    const result = await ctx.tx.query.emailTokens.findFirst({
      where: and(eq(emailTokens.userId, userId), isNull(emailTokens.usedAt)),
    });

    if (!result) return;

    return EmailToken.rehydrate(result);
  }

  async save(ctx: DrizzleTxContext, token: EmailToken): Promise<void> {
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
  }
}
