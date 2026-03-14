import { GET_CV_USE_CASE } from "@/constants";
import type {
  GetCvInput,
  GetCvOutput,
  GetCvUseCase,
} from "@/domain/ports/in/cvs/get-cv";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type GetCvServiceParams<TxCtx extends TxContext<any>> = {};

export class GetCvService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GetCvUseCase
{
  constructor(params: GetCvServiceParams<TxCtx>) {
    super(GET_CV_USE_CASE);
  }

  getCv(input: GetCvInput): Promise<GetCvOutput> {
    throw new Error("not implemented");
  }
}
