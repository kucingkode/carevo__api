import { UPDATE_CV_USE_CASE } from "@/constants";
import type {
  UpdateCvInput,
  UpdateCvUseCase,
} from "@/domain/ports/in/cvs/update-cv";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type UpdateCvServiceParams<TxCtx extends TxContext<any>> = {};

export class UpdateCvService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements UpdateCvUseCase
{
  constructor(params: UpdateCvServiceParams<TxCtx>) {
    super(UPDATE_CV_USE_CASE);
  }

  updateCv(dto: UpdateCvInput): Promise<void> {
    throw new Error("not implemented");
  }
}
