import type { SendVerificationEmailUseCase } from "@/domain/ports/in/auth/send-verification-email";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { EmailSender } from "@/domain/ports/out/email-sender";
import type { Hasher } from "@/domain/ports/out/hasher";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import { getLogger, type Logger } from "@/observability/logging";

export type SendVerificationEmailServiceParams<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  usersRepository: UsersRepository<TxCtx>;
  hasher: Hasher;
  emailSender: EmailSender;
};

export class SendVerificationEmailService<
  TxCtx extends TxContext<any>,
> implements SendVerificationEmailUseCase {
  private readonly log: Logger;

  private readonly db: Database<TxCtx>;
  private readonly usersRepository: UsersRepository<TxCtx>;
  private readonly hasher: Hasher;

  constructor(params: SendVerificationEmailServiceParams<TxCtx>) {
    this.log = getLogger().child({
      component: SendVerificationEmailService.name,
    });

    this.db = params.db;
    this.usersRepository = params.usersRepository;
    this.hasher = params.hasher;
  }

  async sendVerificationEmail(email: string): Promise<void> {}
}
