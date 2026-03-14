import { REFRESH_USER_TOKEN_USE_CASE } from "@/constants";
import type {
  RefreshUserTokenInput,
  RefreshUserTokenOutput,
  RefreshUserTokenUseCase,
} from "@/domain/ports/in/auth/refresh-user-token";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type RefreshUserTokenServiceParams<TxCtx extends TxContext<any>> = {};

export class RefreshUserTokenService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements RefreshUserTokenUseCase
{
  constructor(params: RefreshUserTokenServiceParams<TxCtx>) {
    super(REFRESH_USER_TOKEN_USE_CASE);
  }

  refreshUserToken(
    dto: RefreshUserTokenInput,
  ): Promise<RefreshUserTokenOutput> {
    throw new Error("not implemented");
  }
}
