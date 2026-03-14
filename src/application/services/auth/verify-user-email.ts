import { VERIFY_USER_EMAIL_USE_CASE } from "@/constants";
import type {
  VerifyUserEmailInput,
  VerifyUserEmailUseCase,
} from "@/domain/ports/in/auth/verify-user-email";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type VerifyUserEmailServiceParams<TxCtx extends TxContext<any>> = {};

export class VerifyUserEmailService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements VerifyUserEmailUseCase
{
  constructor(params: VerifyUserEmailServiceParams<TxCtx>) {
    super(VERIFY_USER_EMAIL_USE_CASE);
  }

  verifyUserEmail(dto: VerifyUserEmailInput): Promise<void> {
    throw new Error("not implemented");
  }
}
