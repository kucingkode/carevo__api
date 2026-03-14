export type UploadFileParams = {
  key: string;
  buffer: Buffer;
  mimeType: string;
};

export type FileMetadata = {
  key: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: Date;
};

export type FileStorage = {
  upload(params: UploadFileParams): Promise<FileMetadata>;
  delete(key: string): Promise<void>;
  getUrl(key: string): Promise<string>;
};
