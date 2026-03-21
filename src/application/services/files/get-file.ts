import { GET_FILE_USE_CASE } from "@/constants";
import { NotFoundError } from "@/domain/errors/domain/not-found-error";
import type {
  GetFileInput,
  GetFileOutput,
  GetFileUseCase,
} from "@/domain/ports/in/files/get-file";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { FilesRepository } from "@/domain/ports/out/database/files-repository";
import { BaseUseCase } from "@/shared/classes/base-use-case";
import { createReadStream } from "node:fs";
import { join } from "node:path";

export type GetFileServiceConfig = {
  storageDir: string;
};

export type GetFileServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  filesRepository: FilesRepository<TxCtx>;
};

export class GetFileService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GetFileUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly filesRepository: FilesRepository<TxCtx>;

  constructor(
    private readonly config: GetFileServiceConfig,
    deps: GetFileServiceDeps<TxCtx>,
  ) {
    super(GET_FILE_USE_CASE);

    this.db = deps.db;
    this.filesRepository = deps.filesRepository;
  }

  async getFile(input: GetFileInput): Promise<GetFileOutput> {
    const file = await this.db.beginTx((ctx) => {
      return this.filesRepository.getById(ctx, input.fileId);
    });

    if (!file) throw new NotFoundError();

    const path = join(this.config.storageDir, file.key);

    const stream = createReadStream(path);

    return {
      mimeType: file.mimeType,
      stream,
    };
  }
}
