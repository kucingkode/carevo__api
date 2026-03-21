import { DomainError } from "./domain-error";

export class AlreadyExistsError extends DomainError {
  message = "Already exists";
  code = "ALREADY_EXISTS";
}
