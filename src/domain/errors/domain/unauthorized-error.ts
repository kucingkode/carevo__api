import { DomainError } from "./domain-error";

export class UnauthorizedError extends DomainError {
  constructor() {
    super("Unauthorized", "UNAUTHORIZED");
  }
}
