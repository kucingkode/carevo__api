import z from "zod";
import { DomainError } from "../errors/domain/domain-error";
import { v4 as uuidV4 } from "uuid";

const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{3,30}$/;

export type UserId = string;

export type UserParams = {
  id: UserId;
  username: string;
  email: string;
  isEmailVerified: boolean;
  passwordHash?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserParams = {
  username: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
};

export type RehydrateUserParams = {
  id: UserId;
  username: string;
  email: string;
  isEmailVerified: boolean;
  passwordHash?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export class User {
  private readonly _id: UserId;
  private _username: string;
  private _email: string;
  private _isEmailVerified: boolean;
  private _passwordHash?: string;
  private _googleId?: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(params: UserParams) {
    if (z.email().safeParse(params.email).error) {
      throw new DomainError(`Invalid email: ${params.email}`);
    }

    if (!USERNAME_PATTERN.test(params.username)) {
      throw new DomainError(`Invalid username: ${params.username}`);
    }

    this._id = params.id;
    this._username = params.username;
    this._email = params.email;
    this._isEmailVerified = params.isEmailVerified;
    this._passwordHash = params.passwordHash;
    this._createdAt = params.createdAt;
    this._updatedAt = params.updatedAt;
  }

  // ===============================
  // Factory methods
  // ===============================
  static create(params: CreateUserParams): User {
    if (!params.passwordHash && !params.googleId) {
      throw new DomainError(
        "User must have either a password or a Google account",
      );
    }

    return new User({
      id: uuidV4(),
      username: params.username,
      email: params.email,
      isEmailVerified: false,
      passwordHash: params.passwordHash,
      googleId: params.googleId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static rehydrate(params: RehydrateUserParams): User {
    return new User({
      id: params.id,
      username: params.username,
      email: params.email,
      isEmailVerified: params.isEmailVerified,
      passwordHash: params.passwordHash,
      googleId: params.googleId,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
  }

  // ===============================
  // Getters
  // ===============================
  get id(): UserId {
    return this._id;
  }

  get username(): string {
    return this._username;
  }

  get email(): string {
    return this._email;
  }

  get isEmailVerified(): boolean {
    return this._isEmailVerified;
  }

  get passwordHash(): string | undefined {
    return this._passwordHash;
  }

  get googleId(): string | undefined {
    return this._googleId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ===============================
  // Domain methods
  // ===============================
  verifyEmail(): void {
    if (this._isEmailVerified) {
      throw new DomainError("Email is already verified");
    }

    this._isEmailVerified = true;
    this._updatedAt = new Date();
  }

  changePasswordHash(passwordHash: string): void {
    if (!passwordHash) throw new DomainError("Password can't be empty");
    this._passwordHash = passwordHash;
    this._updatedAt = new Date();
  }

  // ===============================
  // Persistence
  // ===============================
  toPersistence(): RehydrateUserParams {
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
