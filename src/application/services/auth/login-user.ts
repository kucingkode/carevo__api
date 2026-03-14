import { LOGIN_USER_USE_CASE } from "@/constants";
import type {
  LoginUserInput,
  LoginUserOutput,
  LoginUserUseCase,
} from "@/domain/ports/in/auth/login-user";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import type { TokenProvider } from "@/domain/ports/out/token-provider";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type LoginUserServiceParams<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  usersRepository: UsersRepository<TxCtx>;
  tokenProvider: TokenProvider;
};

export class LoginUserService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements LoginUserUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly usersRepository: UsersRepository<TxCtx>;
  private readonly tokenProvider: TokenProvider;

  constructor(params: LoginUserServiceParams<TxCtx>) {
    super(LOGIN_USER_USE_CASE);

    this.db = params.db;
    this.usersRepository = params.usersRepository;
    this.tokenProvider = params.tokenProvider;
  }

  async loginUser(input: LoginUserInput): Promise<LoginUserOutput> {
    this.db.beginTx(async (ctx) => {
      const user = await this.usersRepository.getByEmail(ctx, input.email);
      if (!user) {
        return;
      }
    });

    return {
      userId: "",
      accessToken: "",
      refreshToken: "",
    };
  }
}
