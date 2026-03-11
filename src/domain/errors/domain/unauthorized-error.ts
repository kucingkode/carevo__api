import { DomainError } from "./domain-error";

export class UnauthorizedError extends DomainError {
  constructor() {
    super("Unauthorized", {
      code: "UNAUTHORIZED",
      httpStatusCode: 401,
    });
  }
}
