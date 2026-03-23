import { DomainError } from "./domain-error";

export class RefreshTokenInvalidError extends DomainError {
  message = "Invalid refresh token";
  code = "REFRESH_TOKEN_INVALID";
}
