import { DomainError } from "./domain-error";

export class InsufficientStorageError extends DomainError {
  message = "Insufficient storage";
  code = "INSUFFICIENT_STORAGE";
}
