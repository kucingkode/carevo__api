export class InfrastructureError extends Error {}

export class ExternalServiceError extends InfrastructureError {}

export class DatabaseError extends ExternalServiceError {}
export class BootcampsRepositoryError extends ExternalServiceError {}
export class CertificationsRepositoryError extends ExternalServiceError {}
export class CommentsRepositoryError extends ExternalServiceError {}
export class CommunitiesRepositoryError extends ExternalServiceError {}
export class CvsRepositoryError extends ExternalServiceError {}
export class FilesRepositoryError extends ExternalServiceError {}
export class PostsRepositoryError extends ExternalServiceError {}
export class UsersRepositoryError extends ExternalServiceError {}
export class RefreshTokensRepositoryError extends ExternalServiceError {}
export class PasswordTokensRepositoryError extends ExternalServiceError {}
export class EmailTokensRepositoryError extends ExternalServiceError {}
export class UserLikesRepositoryError extends ExternalServiceError {}
export class UserCommunitiesRepositoryError extends ExternalServiceError {}

export class CacheError extends ExternalServiceError {}
export class EmailSenderError extends ExternalServiceError {}
export class EmbeddingProviderError extends ExternalServiceError {}
export class FileStorageError extends ExternalServiceError {}
export class HasherError extends ExternalServiceError {}
export class JwtSignerError extends ExternalServiceError {}
export class LlmProviderError extends ExternalServiceError {}
export class PdfGeneratorError extends ExternalServiceError {}
export class TokenProviderError extends ExternalServiceError {}
