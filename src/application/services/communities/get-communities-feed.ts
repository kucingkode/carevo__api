import { GET_COMMUNITIES_FEED_USE_CASE } from "@/constants";
import type {
  GetCommunitiesFeedInput,
  GetCommunitiesFeedOutput,
  GetCommunitiesFeedUseCase,
} from "@/domain/ports/in/communities/get-communities-feed";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type GetCommunitiesFeedServiceParams<TxCtx extends TxContext<any>> = {};

export class GetCommunitiesFeedService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GetCommunitiesFeedUseCase
{
  constructor(params: GetCommunitiesFeedServiceParams<TxCtx>) {
    super(GET_COMMUNITIES_FEED_USE_CASE);
  }

  getCommunitiesFeed(
    input: GetCommunitiesFeedInput,
  ): Promise<GetCommunitiesFeedOutput> {
    throw new Error("not implemented");
  }
}
