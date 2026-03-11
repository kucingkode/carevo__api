export type UploadFileParams = {
  key: string;
  buffer: Buffer;
  mimeType: string;
  size: number;
};

export type FileMetadata = {
  key: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
};

export type FileStorage = {
  upload(params: UploadFileParams): Promise<FileMetadata>;
  delete(key: string): Promise<void>;
  getUrl(key: string): Promise<string>;
  getSignedUrl(key: string, expiresInSeconds: number): Promise<string>;
};
