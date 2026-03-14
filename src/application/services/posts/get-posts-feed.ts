import { GET_POSTS_FEED_USE_CASE } from "@/constants";
import type {
  GetPostsFeedInput,
  GetPostsFeedOutput,
  GetPostsFeedUseCase,
} from "@/domain/ports/in/posts/get-posts-feed";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type GetPostsFeedServiceParams<TxCtx extends TxContext<any>> = {};

export class GetPostsFeedService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GetPostsFeedUseCase
{
  constructor(params: GetPostsFeedServiceParams<TxCtx>) {
    super(GET_POSTS_FEED_USE_CASE);
  }

  getPostsFeed(input: GetPostsFeedInput): Promise<GetPostsFeedOutput> {
    throw new Error("not implemented");
  }
}
