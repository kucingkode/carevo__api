import type { User } from "@/domain/models/user";
import type { TxContext } from "./database";

export type EmailUsernameAvailability = {
  emailTaken: boolean;
  usernameTaken: boolean;
};

export type UsersRepository<TxCtx extends TxContext<any>> = {
  getByEmail(ctx: TxCtx, email: string): Promise<User | null>;

  insertUser(ctx: TxCtx, user: User): Promise<void>;
  checkAvailability(
    ctx: TxCtx,
    email: string,
    username: string,
  ): Promise<EmailUsernameAvailability>;
};
