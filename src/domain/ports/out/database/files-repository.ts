import type { File } from "@/domain/entities/file";
import type { TxContext } from "./database";

export type FilesRepository<TxCtx extends TxContext> = {
  getById(ctx: TxCtx, fileId: string): Promise<File | undefined>;

  insert(ctx: TxCtx, file: File): Promise<void>;

  deleteById(ctx: TxCtx, fileId: string): Promise<void>;

  updateSize(ctx: TxCtx, fileId: string, sizeBytes: number): Promise<void>;

  getUserTotalSizeBytes(ctx: TxCtx, userId: string): Promise<number>;
};
