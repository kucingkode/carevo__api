import { LOGOUT_USER_USE_CASE } from "@/constants";
import type {
  LogoutUserInput,
  LogoutUserUseCase,
} from "@/domain/ports/in/auth/logout-user";
import type { TokenProvider } from "@/domain/ports/out/token-provider";
import { BaseUseCase } from "@/shared/classes/base-use-case";
import { parseToken } from "@/shared/utils/token-format";

export type LogoutUserServiceDeps = {
  tokenProvider: TokenProvider;
};

export class LogoutUserService
  extends BaseUseCase
  implements LogoutUserUseCase
{
  private readonly tokenProvider: TokenProvider;
  constructor(deps: LogoutUserServiceDeps) {
    super(LOGOUT_USER_USE_CASE);

    this.tokenProvider = deps.tokenProvider;
  }

  async logoutUser(input: LogoutUserInput): Promise<void> {
    await this.tokenProvider.revokeRefreshToken(input.refreshToken);

    this.log.info(
      {
        refreshTokenId: parseToken(input.refreshToken).id,
      },
      "User logged out",
    );
  }
}
