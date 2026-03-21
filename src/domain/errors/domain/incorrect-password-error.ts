import { DomainError } from "./domain-error";

export class IncorrectPasswordError extends DomainError {
  message = "Incorrect password";
  code = "INCORRECT_PASSWORD";
}
