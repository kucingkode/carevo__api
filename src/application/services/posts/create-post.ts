import { CREATE_POST_USE_CASE } from "@/constants";
import { Post } from "@/domain/entities/post";
import type {
  CreatePostInput,
  CreatePostOutput,
  CreatePostUseCase,
} from "@/domain/ports/in/posts/create-post";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { PostsRepository } from "@/domain/ports/out/database/posts-repository";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type CreatePostServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  postsRepository: PostsRepository<TxCtx>;
};

export class CreatePostService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements CreatePostUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly postsRepository: PostsRepository<TxCtx>;

  constructor(deps: CreatePostServiceDeps<TxCtx>) {
    super(CREATE_POST_USE_CASE);

    this.db = deps.db;
    this.postsRepository = deps.postsRepository;
  }

  async createPost(input: CreatePostInput): Promise<CreatePostOutput> {
    const post = Post.create({
      userId: input.requestUserId,
      communityId: input.communityId,
      content: input.content,
    });

    await this.db.beginTx((ctx) => this.postsRepository.insert(ctx, post));

    this.log.info(
      {
        requestUserId: input.requestUserId,
        postId: post.id,
        communityId: post.communityId,
      },
      "Post created",
    );

    return {
      postId: post.id,
      createdAt: post.createdAt,
    };
  }
}
