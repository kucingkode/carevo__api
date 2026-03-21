import { READ_ONLY_DB_TX, RESET_USER_PASSWORD_USE_CASE } from "@/constants";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import { InfrastructureError } from "@/domain/errors/infrastructure-errors";
import type {
  ResetUserPasswordInput,
  ResetUserPasswordUseCase,
} from "@/domain/ports/in/auth/reset-user-password";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { PasswordTokensRepository } from "@/domain/ports/out/database/password-tokens-repository";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import type { Hasher } from "@/domain/ports/out/hasher";
import type { TokenProvider } from "@/domain/ports/out/token-provider";
import { BaseUseCase } from "@/shared/classes/base-use-case";
import { parseToken } from "@/shared/utils/token-format";

export type ResetUserPasswordServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  usersRepository: UsersRepository<TxCtx>;
  passwordTokensRepository: PasswordTokensRepository<TxCtx>;
  hasher: Hasher;
  tokenProvider: TokenProvider;
};

export class ResetUserPasswordService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements ResetUserPasswordUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly usersRepository: UsersRepository<TxCtx>;
  private readonly passwordTokensRepository: PasswordTokensRepository<TxCtx>;
  private readonly hasher: Hasher;
  private readonly tokenProvider: TokenProvider;

  constructor(deps: ResetUserPasswordServiceDeps<TxCtx>) {
    super(RESET_USER_PASSWORD_USE_CASE);

    this.db = deps.db;
    this.usersRepository = deps.usersRepository;
    this.passwordTokensRepository = deps.passwordTokensRepository;
    this.hasher = deps.hasher;
    this.tokenProvider = deps.tokenProvider;
  }

  async resetUserPassword(input: ResetUserPasswordInput): Promise<void> {
    const { id: userId, secret } = parseToken(input.token);

    const logCtx = {
      userId,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
    };

    // retrieve token
    const token = await this.db.beginTx((ctx) => {
      return this.passwordTokensRepository.getByUserId(ctx, userId);
    }, READ_ONLY_DB_TX);

    if (!token) {
      this.log.warn(logCtx, "Failed reset password attempt: token not found");
      throw new UnauthorizedError();
    }

    // validate secret
    const isCorrect = await this.hasher.compare(secret, token.tokenHash);
    if (!isCorrect) {
      this.log.warn(logCtx, "Failed reset password attempt: incorrect secret");
      throw new UnauthorizedError();
    }

    // retrieve user
    const user = await this.db.beginTx(
      (ctx) => {
        return this.usersRepository.getById(ctx, userId);
      },
      {
        accessMode: "read only",
      },
    );

    if (!user) {
      this.log.error(
        logCtx,
        "Data integrity violation: valid reset token exists but user not found",
      );

      throw new InfrastructureError("Data integrity violation");
    }

    if (!user.passwordHash) {
      this.log.error(
        logCtx,
        "Data integrity violation: password reset token exists for OAuth-only user",
      );

      throw new InfrastructureError("Data integrity violation");
    }

    // update password & use token
    const newHash = await this.hasher.hash(input.newPassword);
    user.changePasswordHash(newHash);

    token.use();

    await this.db.beginTx(async (ctx) => {
      await this.usersRepository.update(ctx, user);
      await this.passwordTokensRepository.save(ctx, token);
      await this.tokenProvider.revokeAllByUserId(user.id);
    });

    this.log.info(logCtx, "User password reset completed");
  }
}
