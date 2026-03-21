import { cacheNamespaces, DELETE_POST_LIKE_USE_CASE } from "@/constants";
import type {
  DeletePostLikeInput,
  DeletePostLikeUseCase,
} from "@/domain/ports/in/posts/delete-post-like";
import type { Cache } from "@/domain/ports/out/cache";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { UserLikesRepository } from "@/domain/ports/out/database/user-likes-repository";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type DeletePostLikeServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  userLikesRepository: UserLikesRepository<TxCtx>;
  cache: Cache;
};

export class DeletePostLikeService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements DeletePostLikeUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly userLikesRepository: UserLikesRepository<TxCtx>;
  private readonly cache: Cache;

  constructor(deps: DeletePostLikeServiceDeps<TxCtx>) {
    super(DELETE_POST_LIKE_USE_CASE);

    this.db = deps.db;
    this.userLikesRepository = deps.userLikesRepository;
    this.cache = deps.cache;
  }

  async deletePostLike(input: DeletePostLikeInput): Promise<void> {
    await this.db.beginTx((ctx) =>
      this.userLikesRepository.delete(ctx, input.requestUserId, input.postId),
    );

    await this.updateCache(input.postId);

    this.log.info(
      { requestUserId: input.requestUserId, postId: input.postId },
      "User like deleted",
    );
  }

  private async updateCache(postId: string) {
    const key = `${cacheNamespaces.POST_LIKES}:${postId}`;
    const current = +this.cache.get(key);
    if (!current) return;
    this.cache.set(key, (current - 1).toString());
  }
}
