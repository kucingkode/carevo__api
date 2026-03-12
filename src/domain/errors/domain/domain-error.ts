export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: any,
  ) {
    super(message);
  }
}
