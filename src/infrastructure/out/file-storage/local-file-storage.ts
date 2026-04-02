import { FILE_STORAGE_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type {
  FileStorage,
  UploadFileParams,
  UploadFileResult,
} from "@/domain/ports/out/file-storage";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import { dirname, join } from "node:path";
import { rm, mkdir, stat } from "node:fs/promises";
import { FileStorageError } from "@/domain/errors/infrastructure-errors";

export type LocalFileStorageConfig = {
  storageDir: string;
};

export class LocalFileStorage extends BaseAdapter implements FileStorage {
  constructor(private readonly config: LocalFileStorageConfig) {
    super(FILE_STORAGE_PORT, OUTBOUND_DIRECTION, FileStorageError);
  }

  async upload(params: UploadFileParams): Promise<UploadFileResult> {
    const path = join(this.config.storageDir, params.key);

    await this.call(
      () => mkdir(dirname(path), { recursive: true }),
      "upload: mkdir failed",
    );

    await this.call(
      () => pipeline(params.source, createWriteStream(path)),
      "upload: write pipeline failed",
    );

    return {
      sizeBytes: (await stat(path)).size,
    };
  }

  async delete(key: string): Promise<void> {
    const path = join(this.config.storageDir, key);
    await this.call(() => rm(path, { force: true }), "delete: rm failed");
  }
}
