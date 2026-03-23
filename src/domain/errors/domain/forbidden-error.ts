import { DomainError } from "./domain-error";

export class ForbiddenError extends DomainError {
  message = "Forbidden";
  code = "FORBIDDEN";
}
