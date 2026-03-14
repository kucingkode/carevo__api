import { LIST_PROFTOS_USE_CASE } from "@/constants";
import type {
  ListProftosInput,
  ListProftosOutput,
  ListProftosUseCase,
} from "@/domain/ports/in/proftos/list-proftos";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type ListProftosServiceParams<TxCtx extends TxContext<any>> = {};

export class ListProftosService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements ListProftosUseCase
{
  constructor(params: ListProftosServiceParams<TxCtx>) {
    super(LIST_PROFTOS_USE_CASE);
  }

  listProftos(dto: ListProftosInput): Promise<ListProftosOutput> {
    throw new Error("not implemented");
  }
}
