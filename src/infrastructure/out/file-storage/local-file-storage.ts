import { FILE_STORAGE_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type {
  FileMetadata,
  FileStorage,
  UploadFileParams,
} from "@/domain/ports/out/file-storage";
import { BaseAdapter } from "@/shared/classes/base-adapter";

export type LocalFileStorageParams = {};

export class LocalFileStorage extends BaseAdapter implements FileStorage {
  constructor(params: LocalFileStorageParams) {
    super(FILE_STORAGE_PORT, OUTBOUND_DIRECTION);
  }

  upload(params: UploadFileParams): Promise<FileMetadata> {
    throw new Error("not implemented");
  }

  download(key: string): Promise<Buffer> {
    throw new Error("not implemented");
  }

  delete(key: string): Promise<void> {
    throw new Error("not implemented");
  }

  getMetadata(key: string): Promise<FileMetadata> {
    throw new Error("not implemented");
  }

  getUrl(key: string): Promise<string> {
    throw new Error("not implemented");
  }
}
