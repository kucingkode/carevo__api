import { UPDATE_USER_PROFTO_USE_CASE } from "@/constants";
import { ForbiddenError } from "@/domain/errors/domain/forbidden-error";
import type {
  UpdateUserProftoInput,
  UpdateUserProftoUseCase,
} from "@/domain/ports/in/users/update-user-profto";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { FilesRepository } from "@/domain/ports/out/database/files-repository";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import type { FileStorage } from "@/domain/ports/out/file-storage";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type UpdateUserProftoServiceDeps<TxCtx extends TxContext> = {
  db: Database<TxCtx>;
  usersRepository: UsersRepository<TxCtx>;
  filesRepository: FilesRepository<TxCtx>;
  fileStorage: FileStorage;
};

export class UpdateUserProftoService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements UpdateUserProftoUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly usersRepository: UsersRepository<TxCtx>;
  private readonly filesRepository: FilesRepository<TxCtx>;
  private readonly fileStorage: FileStorage;

  constructor(deps: UpdateUserProftoServiceDeps<TxCtx>) {
    super(UPDATE_USER_PROFTO_USE_CASE);

    this.db = deps.db;
    this.usersRepository = deps.usersRepository;
    this.filesRepository = deps.filesRepository;
    this.fileStorage = deps.fileStorage;
  }

  async updateUserProfto(input: UpdateUserProftoInput): Promise<void> {
    if (input.requestUserId !== input.userId) throw new ForbiddenError();

    const fileIds = this.getFileIds(input.profto);

    const removedFileKeys = await this.db.beginTx(async (ctx) => {
      const prev = await this.usersRepository.getProftoByUserId(
        ctx,
        input.userId,
      );

      await this.usersRepository.partialUpdateProfto(
        ctx,
        input.userId,
        input.profto,
      );

      if (prev) {
        const prevFileIds = this.getFileIds(prev);
        const removedFileIds = prevFileIds.filter((v) => !fileIds.includes(v));

        const deletionPromises = removedFileIds.map((fileId) =>
          this.filesRepository.delete(ctx, input.userId, fileId),
        );

        return await Promise.all(deletionPromises);
      }
    });

    // delete files from storage, ignore failures
    if (removedFileKeys?.length) {
      const deletionPromises = removedFileKeys
        .filter((v) => v !== undefined)
        .map((fileKey) => this.fileStorage.delete(fileKey).catch((e) => e));

      await Promise.all(deletionPromises);
    }

    this.log.info({ requestUserId: input.requestUserId }, "User profto udated");
  }

  getFileIds(obj: Record<string, any>): string[] {
    const fileIds = [];
    for (const [key, value] of Object.entries(obj)) {
      if (typeof obj[key] === "object") {
        if (Array.isArray(obj[key])) {
          obj[key].forEach((v) => {
            fileIds.push(...this.getFileIds(v));
          });
        } else {
          fileIds.push(...this.getFileIds(obj[key]));
        }
      }

      if (typeof obj[key] === "string" && key.endsWith("FileId")) {
        fileIds.push(value);
      }
    }

    return fileIds;
  }
}
