import { cacheNamespaces, LIKE_POST_USE_CASE } from "@/constants";
import type {
  LikePostInput,
  LikePostUseCase,
} from "@/domain/ports/in/posts/like-post";
import type { Cache } from "@/domain/ports/out/cache";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { UserLikesRepository } from "@/domain/ports/out/database/user-likes-repository";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type LikePostServiceDeps<TxCtx extends TxContext> = {
  db: Database<TxCtx>;
  userLikesRepository: UserLikesRepository<TxCtx>;
  cache: Cache;
};

export class LikePostService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements LikePostUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly userLikesRepository: UserLikesRepository<TxCtx>;
  private readonly cache: Cache;

  constructor(deps: LikePostServiceDeps<TxCtx>) {
    super(LIKE_POST_USE_CASE);

    this.db = deps.db;
    this.userLikesRepository = deps.userLikesRepository;
    this.cache = deps.cache;
  }

  async likePost(input: LikePostInput): Promise<void> {
    await this.db.beginTx((ctx) =>
      this.userLikesRepository.insert(ctx, input.requestUserId, input.postId),
    );

    await this.updateCache(input.postId);

    this.log.info(
      { requestUserId: input.requestUserId, postId: input.postId },
      "User like created",
    );
  }

  private async updateCache(postId: string) {
    const key = `${cacheNamespaces.POST_LIKES}:${postId}`;
    const current = +this.cache.get(key);
    if (!current) return;
    this.cache.set(key, (current + 1).toString());
  }
}
