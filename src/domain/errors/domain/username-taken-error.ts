import { DomainError } from "./domain-error";

export class UsernameTakenError extends DomainError {
  message = "Username is already taken";
  code = "USERNAME_TAKEN";
}
