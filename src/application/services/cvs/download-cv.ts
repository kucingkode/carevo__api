import { DOWNLOAD_CV_USE_CASE } from "@/constants";
import type {
  DownloadCvInput,
  DownloadCvOutput,
  DownloadCvUseCase,
} from "@/domain/ports/in/cvs/download-cv";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type DownloadCvServiceParams<TxCtx extends TxContext<any>> = {};

export class DownloadCvService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements DownloadCvUseCase
{
  constructor(params: DownloadCvServiceParams<TxCtx>) {
    super(DOWNLOAD_CV_USE_CASE);
  }

  downloadCv(input: DownloadCvInput): Promise<DownloadCvOutput> {
    throw new Error("not implemented");
  }
}
