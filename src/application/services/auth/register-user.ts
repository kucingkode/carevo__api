import { EmailTakenError } from "@/domain/errors/domain/email-taken-error";
import { UsernameTakenError } from "@/domain/errors/domain/username-taken-error";
import { User } from "@/domain/entities/user";
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
import { Profto } from "@/domain/entities/profto";
import { Cv } from "@/domain/entities/cv";

export type RegisterUserServiceDeps<TxCtx extends TxContext<any>> = {
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

  constructor(deps: RegisterUserServiceDeps<TxCtx>) {
    super(REGISTER_USER_USE_CASE);

    this.db = deps.db;
    this.usersRepository = deps.usersRepository;
    this.hasher = deps.hasher;
  }

  async registerUser(input: RegisterUserInput): Promise<void> {
    const logCtx: any = {
      email: input.email,
      username: input.username,
      ipAddress: input.ipAddress,
    };

    // check availability
    const { usernameTaken, emailTaken } = await this.db.beginTx((ctx) => {
      return this.usersRepository.checkAvailability(
        ctx,
        input.email,
        input.username,
      );
    });

    if (usernameTaken) {
      throw new UsernameTakenError();
    }

    if (emailTaken) {
      this.log.warn(logCtx, "Failed registration attempt: taken email");
      throw new EmailTakenError();
    }

    // create new user
    const passwordHash = await this.hasher.hash(input.password);

    const user = User.create({
      email: input.email,
      username: input.username,
      passwordHash: passwordHash,
      googleId: null,
    });

    const profto = Profto.create(user.id);
    const cv = Cv.create(user.id);

    // insert user
    await this.db.beginTx((ctx) => {
      return this.usersRepository.insert(ctx, user, profto, cv);
    });

    this.log.info(logCtx, "User registered");
  }
}
