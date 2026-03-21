import { DomainError } from "./domain-error";

export class NotFoundError extends DomainError {
  code = "NOT_FOUND";
  message = "Not found";
}
