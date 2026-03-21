import { LIST_COMMENTS_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import type {
  ListCommentsInput,
  ListCommentsOutput,
  ListCommentsUseCase,
} from "@/domain/ports/in/comments/list-comments";
import type { CommentsRepository } from "@/domain/ports/out/database/comments-repository";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type ListCommentsServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  commentsRepository: CommentsRepository<TxCtx>;
};

export class ListCommentsService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements ListCommentsUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly commentsRepository: CommentsRepository<TxCtx>;

  constructor(deps: ListCommentsServiceDeps<TxCtx>) {
    super(LIST_COMMENTS_USE_CASE);

    this.db = deps.db;
    this.commentsRepository = deps.commentsRepository;
  }

  async listComments(input: ListCommentsInput): Promise<ListCommentsOutput> {
    const comments = await this.db.beginTx(
      (ctx) =>
        this.commentsRepository.list(ctx, {
          postId: input.postId,
          parentId: input.parentId,
          page: input.page,
          limit: input.limit,
        }),
      READ_ONLY_DB_TX,
    );

    return {
      comments,
    };
  }
}
