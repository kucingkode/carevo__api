import { UPDATE_PROFTO_USE_CASE } from "@/constants";
import type {
  UpdateProftoInput,
  UpdateProftoUseCase,
} from "@/domain/ports/in/proftos/update-profto";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type UpdateProftoServiceParams<TxCtx extends TxContext<any>> = {};

export class UpdateProftoService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements UpdateProftoUseCase
{
  constructor(params: UpdateProftoServiceParams<TxCtx>) {
    super(UPDATE_PROFTO_USE_CASE);
  }

  updateProfto(input: UpdateProftoInput): Promise<void> {
    throw new Error("not implemented");
  }
}
