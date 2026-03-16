export class NotFoundError extends Error {
  public readonly code = "NOT_FOUND";
  public readonly message = "Not found";
}

export class InternalError extends Error {
  public readonly code = "INTERNAL_ERROR";
  public readonly message = "Internal error";
}
