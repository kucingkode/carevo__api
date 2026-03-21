import { DomainError } from "./domain-error";

export class EmailNotVerifiedError extends DomainError {
  message = "Email is not verified";
  code = "EMAIL_NOT_VERIFIED";
}
