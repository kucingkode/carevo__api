import { EmailTakenError } from "@/domain/errors/domain/email-taken-error";
import { UsernameTakenError } from "@/domain/errors/domain/username-taken-error";
import { User } from "@/domain/models/user";
import type {
  RegisterUserInput,
  RegisterUserUseCase,
} from "@/domain/ports/in/auth/register-user";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { EmailSender } from "@/domain/ports/out/email-sender";
import type { Hasher } from "@/domain/ports/out/hasher";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import { REGISTER_USER_USE_CASE } from "@/constants";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type RegisterUserServiceParams<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  usersRepository: UsersRepository<TxCtx>;
  hasher: Hasher;
  emailSender: EmailSender;
};

export class RegisterUserService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements RegisterUserUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly usersRepository: UsersRepository<TxCtx>;
  private readonly hasher: Hasher;

  constructor(params: RegisterUserServiceParams<TxCtx>) {
    super(REGISTER_USER_USE_CASE);

    this.db = params.db;
    this.usersRepository = params.usersRepository;
    this.hasher = params.hasher;
  }

  async registerUser(input: RegisterUserInput): Promise<void> {
    const logCtx: any = {};

    // get row user data
    const passwordHash = await this.hasher.hash(input.password);

    const user = User.create({
      email: input.email,
      username: input.username,
      passwordHash: passwordHash,
    });

    logCtx.email = user.email;
    logCtx.username = user.username;

    await this.db.beginTx(async (ctx) => {
      // check availability
      const { emailTaken, usernameTaken } =
        await this.usersRepository.checkAvailability(
          ctx,
          user.email,
          user.username,
        );

      if (usernameTaken) {
        throw new UsernameTakenError();
      }

      if (emailTaken) {
        this.log.warn(logCtx, "Registration attempt with taken email");
        throw new EmailTakenError();
      }

      // insert user
      await this.usersRepository.insertUser(ctx, user);
    });

    this.log.info(logCtx, "User registered");
  }
}
