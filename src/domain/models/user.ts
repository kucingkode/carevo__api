import { DomainError } from "../errors/domain/domain-error";
import { v7 as uuidV7 } from "uuid";

export type UserData = {
  id: string;
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
    if (!params.passwordHash && !params.googleId) {
      throw new DomainError(
        "User must have either a password or a Google account",
      );
    }

    return new User({
      id: uuidV7(),
      username: params.username,
      email: params.email,
      isEmailVerified: false,
      passwordHash: params.passwordHash,
      googleId: params.googleId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // ===============================
  // Domain
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
