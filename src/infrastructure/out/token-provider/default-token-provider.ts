import { TOKEN_PROVIDER_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type {
  TokenPair,
  TokenProvider,
} from "@/domain/ports/out/token-provider";
import { BaseAdapter } from "@/shared/classes/base-adapter";

export type DefaultTokenProviderParams = {};

export class DefaultTokenProvider extends BaseAdapter implements TokenProvider {
  constructor(params: DefaultTokenProviderParams) {
    super(TOKEN_PROVIDER_PORT, OUTBOUND_DIRECTION);
  }

  issueTokenPair(userId: string): Promise<TokenPair> {
    throw new Error("not implemented");
  }

  renewTokenPair(refreshToken: string): Promise<TokenPair> {
    throw new Error("not implemented");
  }

  revokeAllByUserId(userId: string): Promise<void> {
    throw new Error("not implemented");
  }

  revokeRefreshToken(refreshToken: string): Promise<void> {
    throw new Error("not implemented");
  }

  verifyAccessToken(token: string): Promise<string> {
    throw new Error("not implemented");
  }
}
