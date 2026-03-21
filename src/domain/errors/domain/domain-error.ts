export class DomainError extends Error {
  code?: string;

  constructor(message?: string, code?: string, cause?: any) {
    super(message, {
      cause,
    });

    this.code = code;
  }
}
