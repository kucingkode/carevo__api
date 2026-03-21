import { LIST_COMMUNITIES_USE_CASE } from "@/constants";
import type {
  ListCommunitiesInput,
  ListCommunitiesOutput,
  ListCommunitiesUseCase,
} from "@/domain/ports/in/communities/list-communities";
import type { CommunitiesRepository } from "@/domain/ports/out/database/communities-repository";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type ListCommunitiesServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  communitiesRepository: CommunitiesRepository<TxCtx>;
};

export class ListCommunitiesService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements ListCommunitiesUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly communitiesRepository: CommunitiesRepository<TxCtx>;

  constructor(deps: ListCommunitiesServiceDeps<TxCtx>) {
    super(LIST_COMMUNITIES_USE_CASE);

    this.db = deps.db;
    this.communitiesRepository = deps.communitiesRepository;
  }

  async listCommunities(
    input: ListCommunitiesInput,
  ): Promise<ListCommunitiesOutput> {
    const communities = await this.db.beginTx((ctx) =>
      this.communitiesRepository.list(ctx, {
        query: input.query,
        page: input.page,
        limit: input.limit,
      }),
    );

    return {
      communities,
    };
  }
}
