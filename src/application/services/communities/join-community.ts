import { JOIN_COMMUNITY_USE_CASE } from "@/constants";
import type {
  JoinCommunityInput,
  JoinCommunityUseCase,
} from "@/domain/ports/in/communities/join-community";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type JoinCommunityServiceParams<TxCtx extends TxContext<any>> = {};

export class JoinCommunityService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements JoinCommunityUseCase
{
  constructor(params: JoinCommunityServiceParams<TxCtx>) {
    super(JOIN_COMMUNITY_USE_CASE);
  }

  joinCommunity(dto: JoinCommunityInput): Promise<void> {
    throw new Error("not implemented");
  }
}
