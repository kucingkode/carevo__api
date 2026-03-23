import { DELETE_POST_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import { ForbiddenError } from "@/domain/errors/domain/forbidden-error";
import { NotFoundError } from "@/domain/errors/domain/not-found-error";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import type {
  DeletePostInput,
  DeletePostUseCase,
} from "@/domain/ports/in/posts/delete-post";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { PostsRepository } from "@/domain/ports/out/database/posts-repository";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type DeletePostServiceDeps<TxCtx extends TxContext> = {
  db: Database<TxCtx>;
  postsRepository: PostsRepository<TxCtx>;
};

export class DeletePostService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements DeletePostUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly postsRepository: PostsRepository<TxCtx>;

  constructor(deps: DeletePostServiceDeps<TxCtx>) {
    super(DELETE_POST_USE_CASE);

    this.db = deps.db;
    this.postsRepository = deps.postsRepository;
  }

  async deletePost(input: DeletePostInput): Promise<void> {
    const post = await this.db.beginTx(
      (ctx) => this.postsRepository.getById(ctx, input.postId),
      READ_ONLY_DB_TX,
    );

    if (!post) throw new NotFoundError();
    if (post.userId !== input.requestUserId) throw new ForbiddenError();

    await this.db.beginTx((ctx) =>
      this.postsRepository.deleteById(ctx, post.id),
    );

    this.log.info(
      { requestUserId: input.requestUserId, postId: input.postId },
      "Post deleted",
    );
  }
}
