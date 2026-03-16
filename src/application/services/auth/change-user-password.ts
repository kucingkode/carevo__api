import { CHANGE_USER_PASSWORD_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import { IncorrectPasswordError } from "@/domain/errors/domain/incorrect-password-error";
import { NoPasswordSetError } from "@/domain/errors/domain/no-password-set-error";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import type {
  ChangeUserPasswordInput,
  ChangeUserPasswordUseCase,
} from "@/domain/ports/in/auth/change-user-password";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import type { Hasher } from "@/domain/ports/out/hasher";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type ChangeUserPasswordServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  usersRepository: UsersRepository<TxCtx>;
  hasher: Hasher;
};

export class ChangeUserPasswordService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements ChangeUserPasswordUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly usersRepository: UsersRepository<TxCtx>;
  private readonly hasher: Hasher;

  constructor(deps: ChangeUserPasswordServiceDeps<TxCtx>) {
    super(CHANGE_USER_PASSWORD_USE_CASE);

    this.db = deps.db;
    this.usersRepository = deps.usersRepository;
    this.hasher = deps.hasher;
  }

  async changeUserPassword(input: ChangeUserPasswordInput): Promise<void> {
    const logCtx = {
      userId: input.requestUserId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    };

    // get user
    const user = await this.db.beginTx((ctx) => {
      return this.usersRepository.getById(ctx, input.requestUserId);
    }, READ_ONLY_DB_TX);

    if (!user) {
      this.log.warn(logCtx, "Failed change password attempt: missing user");
      throw new UnauthorizedError();
    }

    if (!user.passwordHash) {
      this.log.warn(logCtx, "Failed change password attempt: no password set");
      throw new NoPasswordSetError();
    }

    // verify password
    const isCorrect = await this.hasher.compare(
      input.oldPassword,
      user.passwordHash,
    );

    if (!isCorrect) {
      this.log.warn(
        logCtx,
        "Failed change password attempt: incorrect password",
      );
      throw new IncorrectPasswordError();
    }

    const newHash = await this.hasher.hash(input.newPassword);

    user.changePasswordHash(newHash);

    // update user
    await this.db.beginTx(async (ctx) => {
      await this.usersRepository.update(ctx, user);
    });

    this.log.info(logCtx, "User password changed");
  }
}
