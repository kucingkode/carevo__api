import { DomainError } from "./domain-error";

export class IncorrectCredentialsError extends DomainError {
  constructor() {
    super("Invalid email or password", "INCORRECT_CREDENTIALS");
  }
}
