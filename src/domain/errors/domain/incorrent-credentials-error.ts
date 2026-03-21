import { DomainError } from "./domain-error";

export class IncorrectCredentialsError extends DomainError {
  message = "Invalid email or password";
  code = "INCORRECT_CREDENTIALS";
}
