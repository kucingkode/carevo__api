import z from "zod";
import { DomainError } from "../errors/domain/domain-error";
import { v7 as uuidV7 } from "uuid";

// ===============================
// Schema & Types
// ===============================

export const userDataSchema = z.object({
  id: z.uuidv7(),
  username: z.string().regex(/^[a-zA-Z0-9_-]{3,30}$/),
  email: z.email().max(255),
  isEmailVerified: z.boolean(),
  passwordHash: z.string().optional(),
  googleId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserData = z.infer<typeof userDataSchema>;

export type CreateUserParams = {
  username: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
};

// ===============================
// Errors
// ===============================

class UserValidationError extends DomainError {
  constructor(message?: string) {
    super(message || "Invalid user", "VALIDATION_ERROR");
  }
}

// ===============================
// Entity
// ===============================

export class User {
  private readonly _id: string;
  private _username: string;
  private _email: string;
  private _isEmailVerified: boolean;
  private _passwordHash?: string;
  private _googleId?: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(data: UserData) {
    this._id = data.id;
    this._username = data.username;
    this._email = data.email;
    this._isEmailVerified = data.isEmailVerified;
    this._passwordHash = data.passwordHash;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  // ===============================
  // Factory
  // ===============================
  static create(params: CreateUserParams): User {
    const result = userDataSchema.safeParse({
      ...params,
      id: uuidV7(),
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!result.success) {
      throw new UserValidationError();
    }

    if (!params.passwordHash && !params.googleId) {
      throw new UserValidationError(
        "User must have either a password or a Google account",
      );
    }

    return new User(result.data);
  }

  // ===============================
  // Domain
  // ===============================
  verifyEmail(): void {
    if (this._isEmailVerified) {
      throw new DomainError("Email is already verified", "CONFLICT");
    }

    this._isEmailVerified = true;
    this._updatedAt = new Date();
  }

  changePasswordHash(passwordHash: string): void {
    if (!passwordHash)
      throw new DomainError("Password can't be empty", "CONFLICT");
    this._passwordHash = passwordHash;
    this._updatedAt = new Date();
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

  // ===============================
  // Persistence
  // ===============================
  toPersistence(): UserData {
    return {
      id: this._id,
      username: this._username,
      email: this._email,
      isEmailVerified: this._isEmailVerified,
      passwordHash: this._passwordHash,
      googleId: this._googleId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
