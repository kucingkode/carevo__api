export type DomainErrorConfig = {
  httpStatusCode?: number;
  code?: string;
  cause?: any;
};

export class DomainError extends Error {
  code?: string;
  httpStatusCode: number;

  constructor(message: string, config?: DomainErrorConfig) {
    super(message);
    this.code = config?.code;
    this.httpStatusCode = config?.httpStatusCode || 409;
    this.cause = config?.cause;
  }
}
