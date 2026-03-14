import { LOGOUT_USER_USE_CASE } from "@/constants";
import type {
  LogoutUserInput,
  LogoutUserUseCase,
} from "@/domain/ports/in/auth/logout-user";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type LogoutUserServiceParams<TxCtx extends TxContext<any>> = {};

export class LogoutUserService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements LogoutUserUseCase
{
  constructor(params: LogoutUserServiceParams<TxCtx>) {
    super(LOGOUT_USER_USE_CASE);
  }

  logoutUser(input: LogoutUserInput): Promise<void> {
    throw new Error("not implemented");
  }
}
