import { DomainError } from "./domain-error";

export class UnauthorizedError extends DomainError {
  message = "Unauthorized";
  code = "UNAUTHORIZED";
}
