import { JOIN_COMMUNITY_USE_CASE } from "@/constants";
import type {
  JoinCommunityInput,
  JoinCommunityUseCase,
} from "@/domain/ports/in/communities/join-community";
import type { UserCommunitiesRepository } from "@/domain/ports/out/database/user-communities-repository";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type JoinCommunityServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  userCommunitiesRepository: UserCommunitiesRepository<TxCtx>;
};

export class JoinCommunityService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements JoinCommunityUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly userCommunitiesRepository: UserCommunitiesRepository<TxCtx>;

  constructor(deps: JoinCommunityServiceDeps<TxCtx>) {
    super(JOIN_COMMUNITY_USE_CASE);

    this.db = deps.db;
    this.userCommunitiesRepository = deps.userCommunitiesRepository;
  }

  async joinCommunity(input: JoinCommunityInput): Promise<void> {
    await this.db.beginTx((ctx) =>
      this.userCommunitiesRepository.insert(
        ctx,
        input.requestUserId,
        input.communityId,
      ),
    );

    this.log.info(
      { requestUserId: input.requestUserId, communityId: input.communityId },
      "User joined community",
    );
  }
}
