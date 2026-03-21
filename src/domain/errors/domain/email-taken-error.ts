import { DomainError } from "./domain-error";

export class EmailTakenError extends DomainError {
  message = "Email is already taken";
  code = "EMAIL_TAKEN";
}
