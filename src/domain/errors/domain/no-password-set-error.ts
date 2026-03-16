import { DomainError } from "./domain-error";

export class NoPasswordSetError extends DomainError {
  constructor() {
    super("No password set", "NO_PASSWORD_SET");
  }
}
