import {
  cacheNamespaces,
  GET_POSTS_FEED_USE_CASE,
  READ_ONLY_DB_TX,
} from "@/constants";
import type { PostDisplay } from "@/domain/entities/post";
import type {
  GetPostsFeedInput,
  GetPostsFeedOutput,
  GetPostsFeedUseCase,
} from "@/domain/ports/in/posts/get-posts-feed";
import type { Cache } from "@/domain/ports/out/cache";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { PostsRepository } from "@/domain/ports/out/database/posts-repository";
import type { UserCommunitiesRepository } from "@/domain/ports/out/database/user-communities-repository";
import type { UserLikesRepository } from "@/domain/ports/out/database/user-likes-repository";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type GetPostsFeedServiceDeps<TxCtx extends TxContext> = {
  db: Database<TxCtx>;
  userCommunitiesRepository: UserCommunitiesRepository<TxCtx>;
  userLikesRepository: UserLikesRepository<TxCtx>;
  postsRepository: PostsRepository<TxCtx>;
  cache: Cache;
};

export class GetPostsFeedService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GetPostsFeedUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly userCommunitiesRepository: UserCommunitiesRepository<TxCtx>;
  private readonly postsRepository: PostsRepository<TxCtx>;
  private readonly userLikesRepository: UserLikesRepository<TxCtx>;
  private readonly cache: Cache;

  constructor(deps: GetPostsFeedServiceDeps<TxCtx>) {
    super(GET_POSTS_FEED_USE_CASE);

    this.db = deps.db;
    this.userCommunitiesRepository = deps.userCommunitiesRepository;
    this.userLikesRepository = deps.userLikesRepository;
    this.postsRepository = deps.postsRepository;
    this.cache = deps.cache;
  }

  async getPostsFeed(input: GetPostsFeedInput): Promise<GetPostsFeedOutput> {
    const postDisplays = await this.db.beginTx(async (ctx) => {
      const communityIds = await this.userCommunitiesRepository.listByUserId(
        ctx,
        input.requestUserId,
      );

      const posts = await this.postsRepository.list(ctx, {
        communityIds,
        page: input.page,
        limit: input.limit,
      });

      const displays: Promise<PostDisplay>[] = posts.map(async (p) => ({
        ...p.toPersistence(),
        totalLikes: await this.getPostTotalLikes(ctx, p.id),
      }));

      return Promise.all(displays);
    }, READ_ONLY_DB_TX);

    return {
      posts: postDisplays,
    };
  }

  private async getPostTotalLikes(ctx: TxCtx, postId: string): Promise<number> {
    const key = `${cacheNamespaces.POST_LIKES}:${postId}`;

    // utilize cache
    const cached = await this.cache.get(key);
    if (cached) {
      return +cached;
    }

    // query from db
    const totalLikes = await this.userLikesRepository.countPostLikes(
      ctx,
      postId,
    );

    // cache result
    this.cache.set(key, totalLikes.toString());

    return totalLikes;
  }
}
