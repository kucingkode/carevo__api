import { READ_ONLY_DB_TX, UPLOAD_FILE_USE_CASE } from "@/constants";
import type { File } from "@/domain/entities/file";
import type {
  UploadFileInput,
  UploadFileOutput,
  UploadFileUseCase,
} from "@/domain/ports/in/files/upload-file";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";
import { v7 as uuidV7 } from "uuid";
import type { FileStorage } from "@/domain/ports/out/file-storage";
import type { FilesRepository } from "@/domain/ports/out/database/files-repository";
import { InsufficientStorageError } from "@/domain/errors/domain/insufficient-storage-error";

export type UploadFileServiceConfig = {
  userStorageBytes: number;
};

export type UploadFileServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  fileStorage: FileStorage;
  filesRepository: FilesRepository<TxCtx>;
};

export class UploadFileService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements UploadFileUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly fileStorage: FileStorage;
  private readonly filesRepository: FilesRepository<TxCtx>;

  constructor(
    private readonly config: UploadFileServiceConfig,
    deps: UploadFileServiceDeps<TxCtx>,
  ) {
    super(UPLOAD_FILE_USE_CASE);

    this.db = deps.db;
    this.fileStorage = deps.fileStorage;
    this.filesRepository = deps.filesRepository;
  }

  async uploadFile(input: UploadFileInput): Promise<UploadFileOutput> {
    // check if storage available
    const usedStorageBytes = await this.db.beginTx(
      (ctx) =>
        this.filesRepository.getUserTotalSizeBytes(ctx, input.requestUserId),
      READ_ONLY_DB_TX,
    );

    if (usedStorageBytes >= this.config.userStorageBytes) {
      throw new InsufficientStorageError();
    }

    // upload file
    const id = uuidV7();

    const a = id.slice(0, 2);
    const b = id.slice(2, 4);
    const key = `${a}/${b}/${id}`;

    const file: File = {
      id,
      mimeType: input.mimeType,
      key,
      ownerId: input.requestUserId,
      sizeBytes: 0,
      createdAt: new Date(),
    };

    await this.db.beginTx(async (ctx) => {
      await this.filesRepository.insert(ctx, file);

      const result = await this.fileStorage.upload({
        key,
        source: input.stream,
      });

      file.sizeBytes = result.sizeBytes;

      await this.filesRepository.updateSize(ctx, file.id, result.sizeBytes);
    });

    this.log.info(
      { requestUserId: input.requestUserId, fileId: file.id },
      "File uploaded",
    );

    return {
      fileId: id,
    };
  }
}
