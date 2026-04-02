import type { File } from "@/domain/entities/file";
import type { TxContext } from "./database";

export type FilesRepository<TxCtx extends TxContext> = {
  getById(ctx: TxCtx, fileId: string): Promise<File | undefined>;

  listByUserId(ctx: TxCtx, userId: string): Promise<File[]>;

  insert(ctx: TxCtx, file: File): Promise<void>;

  /**
   * @returns deleted file key
   */
  delete(
    ctx: TxCtx,
    ownerId: string,
    fileId: string,
  ): Promise<string | undefined>;

  updateSize(ctx: TxCtx, fileId: string, sizeBytes: number): Promise<void>;

  getUserTotalSizeBytes(ctx: TxCtx, userId: string): Promise<number>;
};
