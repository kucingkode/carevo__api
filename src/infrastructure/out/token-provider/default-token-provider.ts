import {
  TOKEN_PROVIDER_PORT,
  OUTBOUND_DIRECTION,
  READ_ONLY_DB_TX,
} from "@/constants";
import { NotFoundError } from "@/domain/errors/domain/not-found-error";
import type { RefreshToken } from "@/domain/entities/refresh-token";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { RefreshTokensRepository } from "@/domain/ports/out/database/refresh-tokens-repository";
import type { Hasher } from "@/domain/ports/out/hasher";
import type { JwtSigner } from "@/domain/ports/out/jwt-signer";
import type {
  AccessTokenPayload,
  IssueTokenPairParams,
  RefreshTokenPairParams,
  TokenPair,
  TokenPairOptions,
  TokenProvider,
} from "@/domain/ports/out/token-provider";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import { parseToken, stringifyToken } from "@/shared/utils/token-format";
import { randomBytes } from "node:crypto";
import { v7 as uuidV7 } from "uuid";
import { TokenProviderError } from "@/domain/errors/infrastructure-errors";

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
    super(TOKEN_PROVIDER_PORT, OUTBOUND_DIRECTION, TokenProviderError);

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
    const accessTokenExp = Date.now() + this.config.accessTokenTtl;

    const accessTokenValue = await this.call(
      () =>
        this.jwtSigner.sign({
          sub: userId,
          exp: accessTokenExp,
        }),
      "issueTokenPair: JWT signing failed",
    );

    const accessToken = {
      value: accessTokenValue,
      expiresAt: new Date(accessTokenExp),
    };

    // get refresh token
    const refreshTokenSecret = randomBytes(32).toString("base64url");
    const refreshTokenHash = await this.call(
      () => this.hasher.hash(refreshTokenSecret),
      "issueTokenPair: secret hashing failed",
    );

    const refreshTokenTtl = options.rememberMe
      ? this.config.refreshTokenTtlExtended
      : this.config.refreshTokenTtl;

    const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenTtl);

    const refreshTokenEntity: RefreshToken = {
      id: uuidV7(),
      userId,
      expiresAt: refreshTokenExpiresAt,
      tokenHash: refreshTokenHash,
      ipAddress,
      userAgent,
      revokedAt: null,
      createdAt: new Date(),
    };

    await this.call(
      () =>
        this.db.beginTx(async (ctx) => {
          await this.refreshTokensRepository.save(ctx, refreshTokenEntity);
        }),
      "issueTokenPair: Refresh token save failed",
    );

    const refreshTokenValue = stringifyToken(
      refreshTokenEntity.id,
      refreshTokenSecret,
    );

    const refreshToken = {
      value: refreshTokenValue,
      expiresAt: refreshTokenExpiresAt,
    };

    this.log.debug(
      { refreshTokenId: refreshTokenEntity.id },
      "Token pair issued",
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokenPair(
    { refreshToken, ipAddress, userAgent }: RefreshTokenPairParams,
    options: TokenPairOptions = {},
  ): Promise<TokenPair> {
    const { id: refreshTokenId } = parseToken(refreshToken);

    // get user id
    const userId = await this.call(
      () =>
        this.db.beginTx(async (ctx) => {
          const result = await this.refreshTokensRepository.getById(
            ctx,
            refreshTokenId,
          );

          return result?.userId ?? null;
        }, READ_ONLY_DB_TX),
      "refreshTokenPair: refresh token retrieval failed",
    );

    if (!userId) {
      throw new NotFoundError("Refresh token not found");
    }

    // get access token
    const accessTokenExp = Date.now() + this.config.accessTokenTtl;
    const accessTokenValue = await this.call(
      () =>
        this.jwtSigner.sign({
          sub: userId,
          exp: accessTokenExp,
        }),
      "issueTokenPair: JWT signing failed",
    );

    const accessToken = {
      value: accessTokenValue,
      expiresAt: new Date(accessTokenExp),
    };

    // get refresh token
    const refreshTokenSecret = randomBytes(32).toString("base64url");
    const refreshTokenHash = await this.call(
      () => this.hasher.hash(refreshTokenSecret),
      "issueTokenPair: secret hashing failed",
    );

    const refreshTokenTtl = options.rememberMe
      ? this.config.refreshTokenTtlExtended
      : this.config.refreshTokenTtl;
    const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenTtl);

    const refreshTokenEntity: RefreshToken = {
      id: uuidV7(),
      userId,
      expiresAt: refreshTokenExpiresAt,
      tokenHash: refreshTokenHash,
      ipAddress,
      userAgent,
      revokedAt: null,
      createdAt: new Date(),
    };

    await this.call(
      () =>
        this.db.beginTx(async (ctx) => {
          await this.refreshTokensRepository.revokeById(ctx, refreshTokenId);
          await this.refreshTokensRepository.save(ctx, refreshTokenEntity);
        }),
      "refreshTokenPair: Repository save and revocation failed",
    );

    const refreshTokenValue = stringifyToken(
      refreshTokenEntity.id,
      refreshTokenSecret,
    );

    const newRefreshToken = {
      value: refreshTokenValue,
      expiresAt: refreshTokenExpiresAt,
    };

    this.log.debug(
      {
        oldRefreshTokenId: refreshTokenId,
        newRefreshTokenId: refreshTokenEntity.id,
      },
      "Token pair refreshed",
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.call(
      () =>
        this.db.beginTx(async (ctx) => {
          await this.refreshTokensRepository.revokeAllByUserId(ctx, userId);
        }),
      "revokeAllByUserId: repository revocation failed",
    );
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.call(
      () =>
        this.db.beginTx(async (ctx) => {
          await this.refreshTokensRepository.revokeById(ctx, refreshToken);
        }),
      "revokeRefreshToken: repository revocation failed",
    );
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload | void> {
    const payload = await this.call(
      () => this.jwtSigner.verify(token),
      "verifyAccessToken: JWT signer verification failed",
    );

    if (payload.exp < Date.now()) {
      return;
    }

    return {
      userId: payload.sub,
    };
  }
}
