import { POSTS_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type {
  ListPostsQuery,
  PostsRepository,
} from "@/domain/ports/out/database/posts-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";
import { Post } from "@/domain/entities/post";
import { PostsRepositoryError } from "@/domain/errors/infrastructure-errors";
import { eq, inArray } from "drizzle-orm";
import { posts } from "../schema";
import { pgMapper } from "../utils/db-error-mapper";
import {
  PG_FK_VIOLATION_ERROR,
  PG_UNIQUE_VIOLATION_ERROR,
} from "../utils/db-error-codes";
import { NotFoundError } from "@/domain/errors/domain/not-found-error";

export class DrizzlePostsRepository
  extends BaseAdapter
  implements PostsRepository<DrizzleTxContext>
{
  constructor() {
    super(POSTS_REPOSITORY_PORT, OUTBOUND_DIRECTION, PostsRepositoryError);
  }

  async getById(
    ctx: DrizzleTxContext,
    postId: string,
  ): Promise<Post | undefined> {
    const result = await ctx.tx.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!result) return;
    return Post.rehydrate(result);
  }

  async list(ctx: DrizzleTxContext, query: ListPostsQuery): Promise<Post[]> {
    const result = await ctx.tx.query.posts.findMany({
      where: query.communityIds
        ? inArray(posts.communityId, query.communityIds)
        : undefined,
      orderBy: posts.createdAt,
    });

    return result.map((v) => Post.rehydrate(v));
  }

  async insert(ctx: DrizzleTxContext, post: Post): Promise<void> {
    const data = post.toPersistence();

    await this.call(
      () => ctx.tx.insert(posts).values(data),
      "insert: database query failed",
      pgMapper({
        [PG_FK_VIOLATION_ERROR]: () => new NotFoundError(),
      }),
    );

    this.log.debug({ postId: data.id, userId: data.userId }, "Post inserted");
  }

  async deleteById(ctx: DrizzleTxContext, postId: string): Promise<void> {
    const result = await ctx.tx
      .delete(posts)
      .where(eq(posts.id, postId))
      .returning({
        id: posts.id,
      });

    this.log.debug({ postId, count: result.length }, "Post inserted");
  }
}
