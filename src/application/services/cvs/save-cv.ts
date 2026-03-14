import { SAVE_CV_USE_CASE } from "@/constants";
import type { SaveCvInput, SaveCvUseCase } from "@/domain/ports/in/cvs/save-cv";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type SaveCvServiceParams<TxCtx extends TxContext<any>> = {};

export class SaveCvService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements SaveCvUseCase
{
  constructor(params: SaveCvServiceParams<TxCtx>) {
    super(SAVE_CV_USE_CASE);
  }

  saveCv(input: SaveCvInput): Promise<void> {
    throw new Error("not implemented");
  }
}
