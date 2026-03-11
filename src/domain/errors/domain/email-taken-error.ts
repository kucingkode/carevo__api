import { DomainError } from "./domain-error";

export class EmailTakenError extends DomainError {
  constructor() {
    super("Email is already taken", {
      code: "EMAIL_TAKEN",
      httpStatusCode: 409,
    });
  }
}
