import { CREATE_COMMENT_USE_CASE } from "@/constants";
import { Comment } from "@/domain/entities/comment";
import type {
  CreateCommentInput,
  CreateCommentOutput,
  CreateCommentUseCase,
} from "@/domain/ports/in/comments/create-comment";
import type { CommentsRepository } from "@/domain/ports/out/database/comments-repository";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type CreateCommentServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  commentsRepository: CommentsRepository<TxCtx>;
};

export class CreateCommentService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements CreateCommentUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly commentsRepository: CommentsRepository<TxCtx>;

  constructor(deps: CreateCommentServiceDeps<TxCtx>) {
    super(CREATE_COMMENT_USE_CASE);

    this.db = deps.db;
    this.commentsRepository = deps.commentsRepository;
  }

  async createComment(input: CreateCommentInput): Promise<CreateCommentOutput> {
    const comment = Comment.create({
      userId: input.requestUserId,
      postId: input.postId,
      parentId: input.parentId,
      content: input.content,
    });

    await this.db.beginTx((ctx) =>
      this.commentsRepository.insert(ctx, comment),
    );

    this.log.info(
      {
        requestUserId: input.requestUserId,
        id: comment.id,
        postId: comment.postId,
      },
      "Comment created",
    );

    return {
      commentId: comment.id,
      createdAt: comment.createdAt,
    };
  }
}
