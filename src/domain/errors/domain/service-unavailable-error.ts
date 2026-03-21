import { DomainError } from "./domain-error";

export class ServiceUnavailableError extends DomainError {
  message = "Service temporarily unavailable";
  code = "SERVICE_UNAVAILABLE";
}
