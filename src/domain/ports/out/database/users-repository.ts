import type { User } from "@/domain/models/user";
import type { TxContext } from "./database";

export type EmailUsernameAvailability = {
  emailTaken: boolean;
  usernameTaken: boolean;
};

export type UsersRepository<TxCtx extends TxContext<any>> = {
  insertUser(ctx: TxCtx, user: User): Promise<void>;
  checkAvailability(
    ctx: TxCtx,
    email: string,
    username: string,
  ): Promise<EmailUsernameAvailability>;
};
