import { LOGIN_USER_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import { EmailNotVerifiedError } from "@/domain/errors/domain/email-not-verified-error";
import { IncorrectCredentialsError } from "@/domain/errors/domain/incorrent-credentials-error";
import type {
  LoginUserInput,
  LoginUserOutput,
  LoginUserUseCase,
} from "@/domain/ports/in/auth/login-user";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import type { Hasher } from "@/domain/ports/out/hasher";
import type { TokenProvider } from "@/domain/ports/out/token-provider";
import { BaseUseCase } from "@/shared/classes/base-use-case";
import { parseToken } from "@/shared/utils/token-format";

export type LoginUserServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  usersRepository: UsersRepository<TxCtx>;
  hasher: Hasher;
  tokenProvider: TokenProvider;
};

export class LoginUserService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements LoginUserUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly usersRepository: UsersRepository<TxCtx>;
  private readonly hasher: Hasher;
  private readonly tokenProvider: TokenProvider;

  constructor(deps: LoginUserServiceDeps<TxCtx>) {
    super(LOGIN_USER_USE_CASE);

    this.db = deps.db;
    this.usersRepository = deps.usersRepository;
    this.hasher = deps.hasher;
    this.tokenProvider = deps.tokenProvider;
  }

  async loginUser(input: LoginUserInput): Promise<LoginUserOutput> {
    const logCtx: any = {
      email: input.email,
      rememberMe: input.rememberMe,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    };

    // get user
    const user = await this.db.beginTx(async (ctx) => {
      return this.usersRepository.getByEmail(ctx, input.email);
    }, READ_ONLY_DB_TX);

    if (!user || !user.passwordHash) {
      this.log.warn(logCtx, "Failed login attempt: incorrect credentials");
      throw new IncorrectCredentialsError();
    }

    // check email verification
    if (!user.isEmailVerified) {
      this.log.warn(logCtx, "Failed login attempt: email is not verified");
      throw new EmailNotVerifiedError();
    }

    // verify password
    const isCorrect = await this.hasher.compare(
      input.password,
      user.passwordHash,
    );

    if (!isCorrect) {
      this.log.warn(logCtx, "Failed login attempt: incorrect credentials");
      throw new IncorrectCredentialsError();
    }

    // issue token pair
    const { accessToken, refreshToken } =
      await this.tokenProvider.issueTokenPair(
        {
          userId: user.id,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        },
        {
          rememberMe: input.rememberMe,
        },
      );

    logCtx.refreshTokenId = parseToken(refreshToken.value).id;
    this.log.info(logCtx, "User logged in");

    return {
      userId: user.id,
      accessToken: accessToken.value,
      accessTokenExpiredAt: accessToken.expiresAt,
      refreshToken: refreshToken.value,
      refreshTokenExpiredAt: refreshToken.expiresAt,
    };
  }
}
