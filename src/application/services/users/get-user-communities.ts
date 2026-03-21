import { GET_USER_COMMUNITIES_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import type {
  GetUserCommunitiesInput,
  GetUserCommunitiesOutput,
  GetUserCommunitiesUseCase,
} from "@/domain/ports/in/users/get-user-communities";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { UserCommunitiesRepository } from "@/domain/ports/out/database/user-communities-repository";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type GetUserCommunitiesServiceDeps<TxCtx extends TxContext> = {
  db: Database<TxCtx>;
  userCommunitiesRepository: UserCommunitiesRepository<TxCtx>;
};

export class GetUserCommunitiesService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GetUserCommunitiesUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly userCommunitiesRepository: UserCommunitiesRepository<TxCtx>;

  constructor(deps: GetUserCommunitiesServiceDeps<TxCtx>) {
    super(GET_USER_COMMUNITIES_USE_CASE);

    this.db = deps.db;
    this.userCommunitiesRepository = deps.userCommunitiesRepository;
  }

  async getUserCommunities(
    input: GetUserCommunitiesInput,
  ): Promise<GetUserCommunitiesOutput> {
    const communityIds = await this.db.beginTx(
      (ctx) => this.userCommunitiesRepository.listByUserId(ctx, input.userId),
      READ_ONLY_DB_TX,
    );

    return {
      communityIds,
    };
  }
}
