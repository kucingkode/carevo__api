import { DomainError } from "./domain-error";

export class NoPasswordSetError extends DomainError {
  message = "No password set";
  code = "NO_PASSWORD_SET";
}
