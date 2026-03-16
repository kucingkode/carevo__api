import {
  TOKEN_PROVIDER_PORT,
  OUTBOUND_DIRECTION,
  READ_ONLY_DB_TX,
} from "@/constants";
import { NotFoundError } from "@/domain/errors/common";
import { TokenProviderError } from "@/domain/errors/infrastructure/token-provider-error";
import type { RefreshToken } from "@/domain/entities/refresh-token";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { RefreshTokensRepository } from "@/domain/ports/out/database/refresh-tokens-repository";
import type { Hasher } from "@/domain/ports/out/hasher";
import type { JwtSigner } from "@/domain/ports/out/jwt-signer";
import type {
  AccessTokenPayload,
  IssuedToken,
  IssueTokenPairParams,
  RefreshTokenPairParams,
  TokenPair,
  TokenPairOptions,
  TokenProvider,
} from "@/domain/ports/out/token-provider";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import { stringifyToken } from "@/shared/utils/token-format";
import { randomBytes } from "node:crypto";
import { v7 as uuidV7 } from "uuid";

export type DefaultTokenProviderConfig = {
  accessTokenTtl: number;
  refreshTokenTtl: number;
  refreshTokenTtlExtended: number;
};

export type DefaultTokenProviderDeps<TxCtx extends TxContext> = {
  db: Database<TxCtx>;
  refreshTokensRepository: RefreshTokensRepository<TxCtx>;
  jwtSigner: JwtSigner;
  hasher: Hasher;
};

export class DefaultTokenProvider<TxCtx extends TxContext>
  extends BaseAdapter
  implements TokenProvider
{
  private readonly db: Database<TxCtx>;
  private readonly refreshTokensRepository: RefreshTokensRepository<TxCtx>;
  private readonly jwtSigner: JwtSigner;
  private readonly hasher: Hasher;

  constructor(
    private readonly config: DefaultTokenProviderConfig,
    deps: DefaultTokenProviderDeps<TxCtx>,
  ) {
    super(TOKEN_PROVIDER_PORT, OUTBOUND_DIRECTION);

    this.db = deps.db;
    this.refreshTokensRepository = deps.refreshTokensRepository;
    this.jwtSigner = deps.jwtSigner;
    this.hasher = deps.hasher;
  }

  async issueTokenPair(
    { userId, ipAddress, userAgent }: IssueTokenPairParams,
    options: TokenPairOptions = {},
  ): Promise<TokenPair> {
    // get access token
    const exp = Date.now() + this.config.accessTokenTtl;

    let accessToken: IssuedToken;
    try {
      const value = await this.jwtSigner.sign({
        sub: userId,
        exp,
      });

      accessToken = {
        value,
        expiresAt: new Date(exp),
      };
    } catch (err) {
      throw new TokenProviderError("Access token signing failed", {
        cause: err,
      });
    }

    // get refresh token
    const secret = randomBytes(32).toString("base64url");
    const ttl = options.rememberMe
      ? this.config.refreshTokenTtlExtended
      : this.config.refreshTokenTtl;

    const expiresAt = new Date(Date.now() + ttl);

    let refreshToken: IssuedToken;
    try {
      const entity: RefreshToken = {
        id: uuidV7(),
        userId,
        expiresAt,
        tokenHash: await this.hasher.hash(secret),
        ipAddress,
        userAgent,
        revokedAt: null,
        createdAt: new Date(),
      };

      const value = await this.db.beginTx(async (ctx) => {
        await this.refreshTokensRepository.save(ctx, entity);
        return stringifyToken(entity.id, secret);
      });

      refreshToken = { value, expiresAt };
    } catch (err) {
      throw new TokenProviderError("Refresh token generation failed", {
        cause: err,
      });
    }

    // sanity check
    if (!refreshToken) {
      throw new TokenProviderError("Refresh token missing");
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokenPair(
    { refreshToken, ipAddress, userAgent }: RefreshTokenPairParams,
    options: TokenPairOptions = {},
  ): Promise<TokenPair> {
    // get user id
    let userId: string | null;

    try {
      userId = await this.db.beginTx(async (ctx) => {
        const result = await this.refreshTokensRepository.get(
          ctx,
          refreshToken,
        );

        return result?.userId ?? null;
      }, READ_ONLY_DB_TX);
    } catch (err) {
      throw new TokenProviderError("Refresh token query failed", {
        cause: err,
      });
    }

    if (!userId) {
      throw new NotFoundError("Refresh token not found");
    }

    const exp = Date.now() + this.config.accessTokenTtl;

    // get access token
    let accessToken: IssuedToken;
    try {
      const value = await this.jwtSigner.sign({
        sub: userId,
        exp,
      });

      accessToken = {
        value,
        expiresAt: new Date(exp),
      };
    } catch (err) {
      throw new TokenProviderError("Access token signing failed", {
        cause: err,
      });
    }

    // get refresh token
    let newRefreshToken: IssuedToken;

    const ttl = options.rememberMe
      ? this.config.refreshTokenTtlExtended
      : this.config.refreshTokenTtl;
    const secret = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + ttl);

    try {
      const value = await this.db.beginTx(async (ctx) => {
        const model: RefreshToken = {
          id: uuidV7(),
          userId,
          expiresAt,
          tokenHash: await this.hasher.hash(secret),
          ipAddress,
          userAgent,
          revokedAt: null,
          createdAt: new Date(),
        };

        await this.refreshTokensRepository.save(ctx, model);
        await this.refreshTokensRepository.revokeByToken(ctx, refreshToken);
        return stringifyToken(model.id, secret);
      });

      newRefreshToken = {
        value,
        expiresAt,
      };
    } catch (err) {
      throw new TokenProviderError("Refresh token generation failed", {
        cause: err,
      });
    }

    // sanity check
    if (!newRefreshToken) {
      throw new TokenProviderError("Refresh token missing");
    }

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    try {
      await this.db.beginTx(async (ctx) => {
        await this.refreshTokensRepository.revokeAllByUserId(ctx, userId);
      });
    } catch (err) {
      throw new TokenProviderError("User tokens revocation failed", {
        cause: err,
      });
    }
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    try {
      await this.db.beginTx(async (ctx) => {
        await this.refreshTokensRepository.revokeByToken(ctx, refreshToken);
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        return;
      }

      throw new TokenProviderError("Token revocation failed", {
        cause: err,
      });
    }
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    try {
      const payload = await this.jwtSigner.verify(token);

      return {
        userId: payload.sub,
      };
    } catch (err) {
      throw new TokenProviderError("Invalid access token", {
        cause: err,
      });
    }
  }
}
