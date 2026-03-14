import { LIST_BOOTCAMPS_USE_CASE } from "@/constants";
import type {
  ListBootcampsInput,
  ListBootcampsOutput,
  ListBootcampsUseCase,
} from "@/domain/ports/in/bootcamps/list-bootcamps";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type ListBootcampsServiceParams<TxCtx extends TxContext<any>> = {};

export class ListBootcampsService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements ListBootcampsUseCase
{
  constructor(params: ListBootcampsServiceParams<TxCtx>) {
    super(LIST_BOOTCAMPS_USE_CASE);
  }

  listBootcamps(dto: ListBootcampsInput): Promise<ListBootcampsOutput> {
    throw new Error("not implemented");
  }
}
