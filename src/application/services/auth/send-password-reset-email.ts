import { SEND_PASSWORD_RESET_EMAIL_USE_CASE } from "@/constants";
import type {
  SendPasswordResetEmailInput,
  SendPasswordResetEmailUseCase,
} from "@/domain/ports/in/auth/send-password-reset-email";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type SendPasswordResetEmailServiceParams<TxCtx extends TxContext<any>> =
  {};

export class SendPasswordResetEmailService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements SendPasswordResetEmailUseCase
{
  constructor(params: SendPasswordResetEmailServiceParams<TxCtx>) {
    super(SEND_PASSWORD_RESET_EMAIL_USE_CASE);
  }

  sendPasswordResetEmail(dto: SendPasswordResetEmailInput): Promise<void> {
    throw new Error("not implemented");
  }
}
