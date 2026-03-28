import type { User, UserSummary } from "@/domain/entities/user";
import type { TxContext } from "./database";
import type {
  Profto,
  ProftoPartialUpdate,
  ProftoProps,
} from "@/domain/entities/profto";
import type { Cv } from "@/domain/entities/cv";

export type EmailUsernameAvailability = {
  emailTaken: boolean;
  usernameTaken: boolean;
};

export type ListUsersQuery = {
  query?: string;
  page?: number;
  limit?: number;
};

export type UsersRepository<TxCtx extends TxContext<any>> = {
  getById(ctx: TxCtx, id: string): Promise<User | undefined>;

  getByEmail(ctx: TxCtx, email: string): Promise<User | undefined>;

  getByGoogleId(ctx: TxCtx, googleId: string): Promise<User | undefined>;

  insert(ctx: TxCtx, user: User, profto: Profto, cv: Cv): Promise<void>;

  update(ctx: TxCtx, user: User): Promise<void>;

  checkAvailability(
    ctx: TxCtx,
    email: string,
    username: string,
  ): Promise<EmailUsernameAvailability>;

  checkEmailAvailability(ctx: TxCtx, email: string): Promise<boolean>;

  list(ctx: TxCtx, query: ListUsersQuery): Promise<UserSummary[]>;

  getProftoByUsername(
    ctx: TxCtx,
    username: string,
  ): Promise<ProftoProps | undefined>;

  getProftoByUserId(
    ctx: TxCtx,
    userId: string,
  ): Promise<ProftoProps | undefined>;

  partialUpdateProfto(
    ctx: TxCtx,
    userId: string,
    partialProfto: ProftoPartialUpdate,
  ): Promise<void>;
};
