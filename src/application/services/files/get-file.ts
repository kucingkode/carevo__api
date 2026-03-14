import { GET_FILE_USE_CASE } from "@/constants";
import type {
  GetFileInput,
  GetFileOutput,
  GetFileUseCase,
} from "@/domain/ports/in/files/get-file";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type GetFileServiceParams<TxCtx extends TxContext<any>> = {};

export class GetFileService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GetFileUseCase
{
  constructor(params: GetFileServiceParams<TxCtx>) {
    super(GET_FILE_USE_CASE);
  }

  getFile(dto: GetFileInput): Promise<GetFileOutput> {
    throw new Error("not implemented");
  }
}
