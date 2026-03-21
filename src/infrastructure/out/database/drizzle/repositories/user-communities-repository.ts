import { POSTS_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type { UserCommunitiesRepository } from "@/domain/ports/out/database/user-communities-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";
import { UserCommunitiesRepositoryError } from "@/domain/errors/infrastructure-errors";
import { and, eq } from "drizzle-orm";
import { userCommunities } from "../schema";
import { pgMapper } from "../utils/db-error-mapper";
import { PG_FK_VIOLATION_ERROR } from "../utils/db-error-codes";
import { onError } from "@/shared/utils/on-error";
import { NotFoundError } from "@/domain/errors/domain/not-found-error";

export class DrizzleUserCommunitiesRepository
  extends BaseAdapter
  implements UserCommunitiesRepository<DrizzleTxContext>
{
  constructor() {
    super(
      POSTS_REPOSITORY_PORT,
      OUTBOUND_DIRECTION,
      UserCommunitiesRepositoryError,
    );
  }

  async listByUserId(ctx: DrizzleTxContext, userId: string): Promise<string[]> {
    const result = await ctx.tx.query.userCommunities.findMany({
      where: eq(userCommunities.userId, userId),
      columns: {
        communityId: true,
      },
    });

    return result.map((v) => v.communityId);
  }

  async insert(
    ctx: DrizzleTxContext,
    userId: string,
    communityId: string,
  ): Promise<void> {
    const result = await onError(
      () =>
        ctx.tx
          .insert(userCommunities)
          .values({
            userId,
            communityId,
          })
          .onConflictDoNothing()
          .returning(),
      pgMapper({
        [PG_FK_VIOLATION_ERROR]: () =>
          new NotFoundError("User or community not found"),
      }),
    );

    this.log.debug(
      { userId, communityId, count: result.length },
      "User community inserted",
    );
  }

  async delete(
    ctx: DrizzleTxContext,
    userId: string,
    communityId: string,
  ): Promise<void> {
    const result = await ctx.tx
      .delete(userCommunities)
      .where(
        and(
          eq(userCommunities.userId, userId),
          eq(userCommunities.communityId, communityId),
        ),
      )
      .returning();

    this.log.debug(
      { userId, communityId, count: result.length },
      "User community deleted",
    );
  }
}
