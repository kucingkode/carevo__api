import { CREATE_COMMENT_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import { ForbiddenError } from "@/domain/errors/domain/forbidden-error";
import { NotFoundError } from "@/domain/errors/domain/not-found-error";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import type {
  DeleteCommentInput,
  DeleteCommentUseCase,
} from "@/domain/ports/in/comments/delete-comment";
import type { CommentsRepository } from "@/domain/ports/out/database/comments-repository";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type DeleteCommentServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  commentsRepository: CommentsRepository<TxCtx>;
};

export class DeleteCommentService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements DeleteCommentUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly commentsRepository: CommentsRepository<TxCtx>;

  constructor(deps: DeleteCommentServiceDeps<TxCtx>) {
    super(CREATE_COMMENT_USE_CASE);

    this.db = deps.db;
    this.commentsRepository = deps.commentsRepository;
  }

  async deleteComment(input: DeleteCommentInput): Promise<void> {
    const comment = await this.db.beginTx(
      (ctx) => this.commentsRepository.getById(ctx, input.commentId),
      READ_ONLY_DB_TX,
    );

    if (!comment) throw new NotFoundError();
    if (comment.postId !== input.postId) throw new NotFoundError();
    if (comment.userId !== input.requestUserId) throw new ForbiddenError();

    await this.db.beginTx((ctx) =>
      this.commentsRepository.deleteById(ctx, input.commentId),
    );

    this.log.info(
      { requestUserId: input.requestUserId, commentId: comment.id },
      "Comment deleted",
    );
  }
}
