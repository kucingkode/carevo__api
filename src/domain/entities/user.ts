import z from "zod";
import { DomainError } from "../errors/domain/domain-error";
import { v7 as uuidV7 } from "uuid";

// ===============================
// Schema & Types
// ===============================

export const userPropsSchema = z.object({
  id: z.uuidv7(),
  username: z.string().regex(/^[a-zA-Z0-9_-]{3,30}$/),
  email: z.email().max(255),
  isEmailVerified: z.boolean(),
  passwordHash: z.string().nullable(),
  googleId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserProps = z.infer<typeof userPropsSchema>;

export type CreateUserParams = {
  username: string;
  email: string;
  passwordHash: string | null;
  googleId: string | null;
};

// ===============================
// Errors
// ===============================

class UserValidationError extends DomainError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
  }
}

// ===============================
// Entity
// ===============================

export class User {
  public readonly id: string;
  private _username: string;
  private _email: string;
  private _isEmailVerified: boolean;
  private _passwordHash: string | null;
  private _googleId: string | null;
  public readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(data: UserProps) {
    this.id = data.id;
    this._username = data.username;
    this._email = data.email;
    this._isEmailVerified = data.isEmailVerified;
    this._passwordHash = data.passwordHash;
    this._googleId = data.googleId;
    this.createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  // ===============================
  // Factory
  // ===============================
  static create(params: CreateUserParams): User {
    const result = userPropsSchema.parse({
      ...params,
      id: uuidV7(),
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!params.passwordHash && !params.googleId) {
      throw new UserValidationError(
        "User must have either a password or a Google account",
      );
    }

    return new User(result);
  }

  static rehydrate(data: UserProps) {
    return new User(data);
  }

  // ===============================
  // Domain
  // ===============================

  verifyEmail(): void {
    this._isEmailVerified = true;
    this._updatedAt = new Date();
  }

  changePasswordHash(passwordHash: string): void {
    if (!passwordHash) throw new UserValidationError("Password can't be empty");

    this._passwordHash = passwordHash;
    this._updatedAt = new Date();
  }

  changeEmail(email: string): void {
    if (!z.email().safeParse(email).success)
      throw new UserValidationError("Invalid email");
    this._email = email;
  }

  changeGoogleId(googleId: string): void {
    this._googleId = googleId;
  }

  // ===============================
  // Getter
  // ===============================

  get email() {
    return this._email;
  }

  get username() {
    return this._username;
  }

  get isEmailVerified() {
    return this._isEmailVerified;
  }

  get passwordHash() {
    return this._passwordHash;
  }

  // ===============================
  // Persistence
  // ===============================
  toPersistence(): UserProps {
    return {
      id: this.id,
      username: this._username,
      email: this._email,
      isEmailVerified: this._isEmailVerified,
      passwordHash: this._passwordHash,
      googleId: this._googleId,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
