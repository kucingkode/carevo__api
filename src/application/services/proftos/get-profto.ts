import { GET_PROFTO_USE_CASE } from "@/constants";
import type {
  GetProftoInput,
  GetProftoOutput,
  GetProftoUseCase,
} from "@/domain/ports/in/proftos/get-profto";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type GetProftoServiceParams<TxCtx extends TxContext<any>> = {};

export class GetProftoService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GetProftoUseCase
{
  constructor(params: GetProftoServiceParams<TxCtx>) {
    super(GET_PROFTO_USE_CASE);
  }

  getProfto(dto: GetProftoInput): Promise<GetProftoOutput> {
    throw new Error("not implemented");
  }
}
