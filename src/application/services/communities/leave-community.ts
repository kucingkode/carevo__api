import { LEAVE_COMMUNITY_USE_CASE } from "@/constants";
import type {
  LeaveCommunityInput,
  LeaveCommunityUseCase,
} from "@/domain/ports/in/communities/leave-community";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { UserCommunitiesRepository } from "@/domain/ports/out/database/user-communities-repository";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type LeaveCommunityServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  userCommunitiesRepository: UserCommunitiesRepository<TxCtx>;
};

export class LeaveCommunityService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements LeaveCommunityUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly userCommunitiesRepository: UserCommunitiesRepository<TxCtx>;

  constructor(deps: LeaveCommunityServiceDeps<TxCtx>) {
    super(LEAVE_COMMUNITY_USE_CASE);

    this.db = deps.db;
    this.userCommunitiesRepository = deps.userCommunitiesRepository;
  }

  async leaveCommunity(input: LeaveCommunityInput): Promise<void> {
    await this.db.beginTx((ctx) =>
      this.userCommunitiesRepository.delete(
        ctx,
        input.requestUserId,
        input.communityId,
      ),
    );

    this.log.info(
      { requestUserId: input.requestUserId, communityId: input.communityId },
      "User leaved community",
    );
  }
}
