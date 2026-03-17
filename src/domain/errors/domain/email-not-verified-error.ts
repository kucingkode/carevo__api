import { DomainError } from "./domain-error";

export class EmailNotVerifiedError extends DomainError {
  constructor() {
    super("Email is not verified", "EMAIL_NOT_VERIFIED");
  }
}
