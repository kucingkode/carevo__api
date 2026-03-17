import type { User } from "@/domain/entities/user";
import type { TxContext } from "./database";

export type EmailUsernameAvailability = {
  emailTaken: boolean;
  usernameTaken: boolean;
};

export type UsersRepository<TxCtx extends TxContext<any>> = {
  getById(ctx: TxCtx, id: string): Promise<User | null>;

  getByEmail(ctx: TxCtx, email: string): Promise<User | null>;

  getByGoogleId(ctx: TxCtx, googleId: string): Promise<User | null>;

  insert(ctx: TxCtx, user: User): Promise<void>;

  update(ctx: TxCtx, user: User): Promise<void>;

  checkAvailability(
    ctx: TxCtx,
    email: string,
    username: string,
  ): Promise<EmailUsernameAvailability>;

  checkEmailAvailability(ctx: TxCtx, email: string): Promise<boolean>;
};
