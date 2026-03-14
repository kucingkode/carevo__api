import { UPLOAD_FILE_USE_CASE } from "@/constants";
import type {
  UploadFileInput,
  UploadFileOutput,
  UploadFileUseCase,
} from "@/domain/ports/in/files/upload-file";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type UploadFileServiceParams<TxCtx extends TxContext<any>> = {};

export class UploadFileService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements UploadFileUseCase
{
  constructor(params: UploadFileServiceParams<TxCtx>) {
    super(UPLOAD_FILE_USE_CASE);
  }

  uploadFile(input: UploadFileInput): Promise<UploadFileOutput> {
    throw new Error("not implemented");
  }
}
