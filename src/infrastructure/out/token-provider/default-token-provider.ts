import { TOKEN_PROVIDER_PORT, OUTBOUND_DIRECTION } from "@/constants";
import { TokenProviderError } from "@/domain/errors/infrastructure/token-provider-error";
import type { RefreshToken } from "@/domain/models/refresh-token";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { RefreshTokensRepository } from "@/domain/ports/out/database/refresh-tokens-repository";
import type { Hasher } from "@/domain/ports/out/hasher";
import type { JwtSigner } from "@/domain/ports/out/jwt-signer";
import type {
  AccessTokenPayload,
  TokenPair,
  TokenProvider,
} from "@/domain/ports/out/token-provider";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import { randomBytes } from "node:crypto";
import { v7 as uuidV7 } from "uuid";

export type DefaultTokenProviderParams<TxCtx extends TxContext> = {
  config: {
    refreshTokenTtl: number;
    accessTokenTtl: number;
  };

  db: Database<TxCtx>;
  refreshTokensRepository: RefreshTokensRepository<TxCtx>;
  jwtSigner: JwtSigner;
  hasher: Hasher;
};

export class DefaultTokenProvider<TxCtx extends TxContext>
  extends BaseAdapter
  implements TokenProvider
{
  private readonly refreshTokenTtl: number;
  private readonly accessTokenTtl: number;
  private readonly db: Database<TxCtx>;
  private readonly refreshTokensRepository: RefreshTokensRepository<TxCtx>;
  private readonly jwtSigner: JwtSigner;
  private readonly hasher: Hasher;

  constructor(params: DefaultTokenProviderParams<TxCtx>) {
    super(TOKEN_PROVIDER_PORT, OUTBOUND_DIRECTION);

    this.accessTokenTtl = params.config.accessTokenTtl;
    this.refreshTokenTtl = params.config.refreshTokenTtl;

    this.db = params.db;
    this.refreshTokensRepository = params.refreshTokensRepository;
    this.jwtSigner = params.jwtSigner;
    this.hasher = params.hasher;
  }

  async issueTokenPair(userId: string): Promise<TokenPair> {
    const exp = Date.now() + this.accessTokenTtl;

    // get access token
    let accessToken: string;
    try {
      accessToken = await this.jwtSigner.sign({
        sub: userId,
        exp,
      });
    } catch (err) {
      throw new TokenProviderError("Access token signing failed", {
        cause: err,
      });
    }

    // get refresh token
    let refreshToken: string;
    try {
      await this.db.beginTx(async (ctx) => {
        const raw = randomBytes(32).toString("base64url");

        const model: RefreshToken = {
          id: uuidV7(),
          userId,
          expiresAt: new Date(Date.now() + this.refreshTokenTtl),
          tokenHash: await this.hasher.hash(raw),
          ipAddress: null,
          userAgent: null,
          revokedAt: null,
          createdAt: new Date(),
        };

        await this.refreshTokensRepository.save(ctx, model);
        refreshToken = `${model.id}.${raw}`;
      });
    } catch (err) {
      throw new TokenProviderError("Refresh token generation failed", {
        cause: err,
      });
    }

    // sanity check
    if (refreshToken! == null) {
      throw new TokenProviderError("Refresh token missing");
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  async renewTokenPair(refreshToken: string): Promise<TokenPair> {
    // get user id
    let userId: string | null = null;

    try {
      await this.db.beginTx(
        async (ctx) => {
          const result = await this.refreshTokensRepository.get(
            ctx,
            refreshToken,
          );

          if (result) {
            userId = result.userId;
          }
        },
        {
          accessMode: "read only",
        },
      );
    } catch (err) {
      throw new TokenProviderError("Refresh token query failed", {
        cause: err,
      });
    }

    if (userId! == null) {
      throw new TokenProviderError("Invalid refresh token");
    }

    const exp = Date.now() + this.accessTokenTtl;

    // get access token
    let accessToken: string;
    try {
      accessToken = await this.jwtSigner.sign({
        sub: userId,
        exp,
      });
    } catch (err) {
      throw new TokenProviderError("Access token signing failed", {
        cause: err,
      });
    }

    // get refresh token
    let newRefreshToken: string | null = null;
    try {
      await this.db.beginTx(async (ctx) => {
        const raw = randomBytes(32).toString("base64url");

        const model: RefreshToken = {
          id: uuidV7(),
          userId: userId!,
          expiresAt: new Date(Date.now() + this.refreshTokenTtl),
          tokenHash: await this.hasher.hash(raw),
          ipAddress: null,
          userAgent: null,
          revokedAt: null,
          createdAt: new Date(),
        };

        await this.refreshTokensRepository.save(ctx, model);
        newRefreshToken = `${model.id}.${raw}`;
      });
    } catch (err) {
      throw new TokenProviderError("Refresh token generation failed", {
        cause: err,
      });
    }

    // sanity check
    if (newRefreshToken! == null) {
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
      throw new TokenProviderError("Access token verification failed", {
        cause: err,
      });
    }
  }
}
