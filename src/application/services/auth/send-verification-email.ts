import { SEND_VERIFICATION_EMAIL_USE_CASE } from "@/constants";
import type {
  SendVerificationEmailInput,
  SendVerificationEmailUseCase,
} from "@/domain/ports/in/auth/send-verification-email";
import type { TxContext } from "@/domain/ports/out/database/database";
import { type Logger } from "@/observability/logging";
import { BaseUseCase } from "@/shared/classes/base-use-case";
import { createUseCaseLogger } from "@/shared/utils/create-use-case-logger";

export type SendVerificationEmailServiceParams<TxCtx extends TxContext<any>> =
  {};

export class SendVerificationEmailService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements SendVerificationEmailUseCase
{
  constructor(params: SendVerificationEmailServiceParams<TxCtx>) {
    super(SEND_VERIFICATION_EMAIL_USE_CASE);
  }

  sendVerificationEmail(dto: SendVerificationEmailInput): Promise<void> {
    throw new Error("not implemented");
  }
}
