import { InfrastructureError } from "./infrastructure-error";

export class DatabaseError extends InfrastructureError {}

export class UsersRepositoryError extends InfrastructureError {}

export class RefreshTokensRepositoryError extends InfrastructureError {}

export class PasswordTokensRepositoryError extends InfrastructureError {}

export class EmailTokensRepositoryError extends InfrastructureError {}
