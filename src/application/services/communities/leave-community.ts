import { LEAVE_COMMUNITY_USE_CASE } from "@/constants";
import type {
  LeaveCommunityInput,
  LeaveCommunityUseCase,
} from "@/domain/ports/in/communities/leave-community";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type LeaveCommunityServiceParams<TxCtx extends TxContext<any>> = {};

export class LeaveCommunityService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements LeaveCommunityUseCase
{
  constructor(params: LeaveCommunityServiceParams<TxCtx>) {
    super(LEAVE_COMMUNITY_USE_CASE);
  }

  leaveCommunity(input: LeaveCommunityInput): Promise<void> {
    throw new Error("not implemented");
  }
}
