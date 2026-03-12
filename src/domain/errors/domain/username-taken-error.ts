import { DomainError } from "./domain-error";

export class UsernameTakenError extends DomainError {
  constructor() {
    super("Username is already taken", "USERNAME_TAKEN");
  }
}
