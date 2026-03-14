import { LIST_COMMUNITIES_USE_CASE } from "@/constants";
import type {
  ListCommunitiesInput,
  ListCommunitiesOutput,
  ListCommunitiesUseCase,
} from "@/domain/ports/in/communities/list-communities";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type ListCommunitiesServiceParams<TxCtx extends TxContext<any>> = {};

export class ListCommunitiesService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements ListCommunitiesUseCase
{
  constructor(params: ListCommunitiesServiceParams<TxCtx>) {
    super(LIST_COMMUNITIES_USE_CASE);
  }

  listCommunities(input: ListCommunitiesInput): Promise<ListCommunitiesOutput> {
    throw new Error("not implemented");
  }
}
