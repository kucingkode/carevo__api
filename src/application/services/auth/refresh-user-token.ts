import { REFRESH_USER_TOKEN_USE_CASE } from "@/constants";
import { NotFoundError } from "@/domain/errors/domain/not-found-error";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import type {
  RefreshUserTokenInput,
  RefreshUserTokenOutput,
  RefreshUserTokenUseCase,
} from "@/domain/ports/in/auth/refresh-user-token";
import type { TokenProvider } from "@/domain/ports/out/token-provider";
import { BaseUseCase } from "@/shared/classes/base-use-case";
import { parseToken } from "@/shared/utils/token-format";

export type RefreshUserTokenServiceDeps = {
  tokenProvider: TokenProvider;
};

export class RefreshUserTokenService
  extends BaseUseCase
  implements RefreshUserTokenUseCase
{
  private readonly tokenProvider: TokenProvider;

  constructor(deps: RefreshUserTokenServiceDeps) {
    super(REFRESH_USER_TOKEN_USE_CASE);

    this.tokenProvider = deps.tokenProvider;
  }

  async refreshUserToken(
    input: RefreshUserTokenInput,
  ): Promise<RefreshUserTokenOutput> {
    const logCtx: any = {
      refreshTokenId: parseToken(input.refreshToken).id,
      rememberMe: input.rememberMe,
    };

    try {
      const { accessToken, refreshToken } =
        await this.tokenProvider.refreshTokenPair(
          {
            refreshToken: input.refreshToken,
            ipAddress: input.ipAddress,
            userAgent: input.userAgent,
          },
          {
            rememberMe: input.rememberMe,
          },
        );

      logCtx.newRefreshTokenId = parseToken(refreshToken.value).id;
      this.log.info(logCtx, "User token refreshed");

      return {
        accessToken: accessToken.value,
        accessTokenExpiredAt: accessToken.expiresAt,
        refreshToken: refreshToken.value,
        refreshTokenExpiredAt: refreshToken.expiresAt,
      };
    } catch (err) {
      if (err instanceof NotFoundError) {
        this.log.warn(
          {
            ...logCtx,
            ipAddress: input.ipAddress,
            userAgent: input.userAgent,
          },
          "Refresh user token attempt failed: invalid refresh token",
        );

        throw new UnauthorizedError();
      }

      throw err;
    }
  }
}
