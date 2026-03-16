import { READ_ONLY_DB_TX, VERIFY_USER_EMAIL_USE_CASE } from "@/constants";
import { InternalError } from "@/domain/errors/common";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import type {
  VerifyUserEmailInput,
  VerifyUserEmailUseCase,
} from "@/domain/ports/in/auth/verify-user-email";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { EmailTokensRepository } from "@/domain/ports/out/database/email-tokens-repository";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import type { Hasher } from "@/domain/ports/out/hasher";
import { BaseUseCase } from "@/shared/classes/base-use-case";
import { parseToken } from "@/shared/utils/token-format";

export type VerifyUserEmailServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  usersRepository: UsersRepository<TxCtx>;
  emailTokensRepository: EmailTokensRepository<TxCtx>;
  hasher: Hasher;
};

export class VerifyUserEmailService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements VerifyUserEmailUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly usersRepository: UsersRepository<TxCtx>;
  private readonly emailTokensRepository: EmailTokensRepository<TxCtx>;
  private readonly hasher: Hasher;

  constructor(deps: VerifyUserEmailServiceDeps<TxCtx>) {
    super(VERIFY_USER_EMAIL_USE_CASE);

    this.db = deps.db;
    this.usersRepository = deps.usersRepository;
    this.emailTokensRepository = deps.emailTokensRepository;
    this.hasher = deps.hasher;
  }

  async verifyUserEmail(input: VerifyUserEmailInput): Promise<void> {
    const { id: userId, secret } = parseToken(input.token);

    const logCtx: any = {
      userId,
      ipAddress: input.ipAddress,
    };

    // retrieve token
    const token = await this.db.beginTx((ctx) => {
      return this.emailTokensRepository.getByUserId(ctx, userId);
    }, READ_ONLY_DB_TX);

    if (!token) {
      this.log.warn(
        logCtx,
        "Email verification attempt failed: token not found",
      );

      throw new UnauthorizedError();
    }

    // verify token
    const isCorrect = await this.hasher.compare(secret, token.tokenHash);
    if (!isCorrect) {
      this.log.warn(logCtx, "Email verification attempt failed: invalid token");
      throw new UnauthorizedError();
    }

    // retrieve user
    const user = await this.db.beginTx((ctx) => {
      return this.usersRepository.getById(ctx, userId);
    });

    if (!user) {
      this.log.error(
        logCtx,
        "Data integrity violation: valid verification token exists but user not found",
      );

      throw new InternalError();
    }

    if (user.isEmailVerified) {
      this.log.error(
        logCtx,
        "Data integrity violation: valid verification token exists for verified user",
      );

      throw new InternalError();
    }

    // update user & use token
    user.verifyEmail();
    token.use();
    await this.db.beginTx(async (ctx) => {
      await this.usersRepository.update(ctx, user);
      await this.emailTokensRepository.save(ctx, token);
    });

    this.log.info(logCtx, "User email verified");
  }
}
