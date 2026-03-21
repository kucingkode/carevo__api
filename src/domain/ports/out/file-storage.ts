import type { PipelineSource } from "node:stream";

export type UploadFileParams = {
  key: string;
  source: readonly PipelineSource<any>[] | PipelineSource<any>;
};

export type UploadFileResult = {
  sizeBytes: number;
};

export type FileStorage = {
  upload(params: UploadFileParams): Promise<UploadFileResult>;
  delete(key: string): Promise<void>;
};
