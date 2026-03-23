import { COMMENTS_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type {
  CommentsRepository,
  ListCommentsQuery,
} from "@/domain/ports/out/database/comments-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";
import { Comment } from "@/domain/entities/comment";
import { getPagination } from "@/shared/utils/pagination";
import { and, eq } from "drizzle-orm";
import { comments } from "../schema";
import { CommentsRepositoryError } from "@/domain/errors/infrastructure-errors";

export class DrizzleCommentsRepository
  extends BaseAdapter
  implements CommentsRepository<DrizzleTxContext>
{
  constructor() {
    super(
      COMMENTS_REPOSITORY_PORT,
      OUTBOUND_DIRECTION,
      CommentsRepositoryError,
    );
  }

  async getById(
    ctx: DrizzleTxContext,
    commentId: string,
  ): Promise<Comment | undefined> {
    const result = await ctx.tx.query.comments.findFirst({
      where: eq(comments.id, commentId),
    });

    if (!result) return;
    return Comment.rehydrate(result);
  }

  async list(
    ctx: DrizzleTxContext,
    query: ListCommentsQuery,
  ): Promise<Comment[]> {
    const { limit, offset } = getPagination(query.page, query.limit);

    const filter = and(
      eq(comments.postId, query.postId),
      query.parentId ? eq(comments.parentId, query.parentId) : undefined,
    );

    const result = await ctx.tx.query.comments.findMany({
      where: filter,
      limit,
      offset,
      orderBy: comments.createdAt,
    });

    return result.map((r) => Comment.rehydrate(r));
  }

  async insert(ctx: DrizzleTxContext, comment: Comment): Promise<void> {
    const data = comment.toPersistence();

    await ctx.tx.insert(comments).values(data);

    this.log.debug(
      { commentId: data.id, userId: data.userId },
      "Comment inserted",
    );
  }

  async deleteById(ctx: DrizzleTxContext, commentId: string): Promise<void> {
    const result = await ctx.tx
      .delete(comments)
      .where(eq(comments.id, commentId))
      .returning({
        id: comments.id,
      });

    this.log.debug({ commentId, count: result.length }, "Comment deleted");
  }
}
