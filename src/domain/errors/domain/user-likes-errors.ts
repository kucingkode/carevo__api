import { DomainError } from "./domain-error";

export class PostAlreadyLikedError extends DomainError {
  message = "Post already liked";
  code = "POST_ALREADY_LIKED";
}
