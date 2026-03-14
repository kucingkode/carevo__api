import { RESET_USER_PASSWORD_USE_CASE } from "@/constants";
import type {
  ResetUserPasswordInput,
  ResetUserPasswordUseCase,
} from "@/domain/ports/in/auth/reset-user-password";
import type { TxContext } from "@/domain/ports/out/database/database";
import { type Logger } from "@/observability/logging";
import { BaseUseCase } from "@/shared/classes/base-use-case";
import { createUseCaseLogger } from "@/shared/utils/create-use-case-logger";

export type ResetUserPasswordServiceParams<TxCtx extends TxContext<any>> = {};

export class ResetUserPasswordService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements ResetUserPasswordUseCase
{
  constructor(params: ResetUserPasswordServiceParams<TxCtx>) {
    super(RESET_USER_PASSWORD_USE_CASE);
  }

  resetUserPassword(input: ResetUserPasswordInput): Promise<void> {
    throw new Error("not implemented");
  }
}
