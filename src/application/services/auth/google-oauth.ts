import { GOOGLE_OAUTH_USE_CASE } from "@/constants";
import type {
  GoogleOauthInput,
  GoogleOauthUseCase,
  GoogleOauthOutput,
} from "@/domain/ports/in/auth/google-oauth";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type GoogleOauthServiceDeps<TxCtx extends TxContext<any>> = {};

export class GoogleOauthService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GoogleOauthUseCase
{
  constructor(deps: GoogleOauthServiceDeps<TxCtx>) {
    super(GOOGLE_OAUTH_USE_CASE);
  }

  async googleOauth(input: GoogleOauthInput): Promise<GoogleOauthOutput> {
    const logCtx: any = {
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    };

    throw new Error("not implemented");
  }
}
