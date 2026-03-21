import { POSTS_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type { UserLikesRepository } from "@/domain/ports/out/database/user-likes-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";
import { UserLikesRepositoryError } from "@/domain/errors/infrastructure-errors";
import { userLikes } from "../schema";
import { and, count, eq } from "drizzle-orm";
import { onError } from "@/shared/utils/on-error";
import { pgMapper } from "../utils/db-error-mapper";
import {
  PG_FK_VIOLATION_ERROR,
  PG_UNIQUE_VIOLATION_ERROR,
} from "../utils/db-error-codes";
import { NotFoundError } from "@/domain/errors/domain/not-found-error";
import { PostAlreadyLikedError } from "@/domain/errors/domain/user-likes-errors";

export class DrizzleUserLikesRepository
  extends BaseAdapter
  implements UserLikesRepository<DrizzleTxContext>
{
  constructor() {
    super(POSTS_REPOSITORY_PORT, OUTBOUND_DIRECTION, UserLikesRepositoryError);
  }

  async insert(
    ctx: DrizzleTxContext,
    userId: string,
    postId: string,
  ): Promise<void> {
    const result = await onError(
      () =>
        ctx.tx
          .insert(userLikes)
          .values({
            userId,
            postId,
          })
          .onConflictDoNothing()
          .returning(),
      pgMapper({
        [PG_FK_VIOLATION_ERROR]: () =>
          new NotFoundError("User or post not found"),
        [PG_UNIQUE_VIOLATION_ERROR]: () => new PostAlreadyLikedError(),
      }),
    );

    this.log.debug(
      { userId, postId, count: result.length },
      "User like inserted",
    );
  }

  async delete(
    ctx: DrizzleTxContext,
    userId: string,
    postId: string,
  ): Promise<void> {
    const result = await ctx.tx
      .delete(userLikes)
      .where(and(eq(userLikes.userId, userId), eq(userLikes.postId, postId)))
      .returning();

    this.log.debug(
      { userId, postId, count: result.length },
      "User like deleted",
    );
  }

  async countPostLikes(ctx: DrizzleTxContext, postId: string): Promise<number> {
    const result = await ctx.tx
      .select({ count: count() })
      .from(userLikes)
      .where(eq(userLikes.postId, postId));

    return result[0].count;
  }

  async exists(
    ctx: DrizzleTxContext,
    userId: string,
    postId: string,
  ): Promise<boolean> {
    const result = await ctx.tx.query.userLikes.findFirst({
      where: and(eq(userLikes.userId, userId), eq(userLikes.postId, postId)),
    });

    return !!result;
  }
}
