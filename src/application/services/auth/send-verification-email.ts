import { SEND_VERIFICATION_EMAIL_USE_CASE } from "@/constants";
import type { EmailToken } from "@/domain/models/email-token";
import type {
  SendVerificationEmailInput,
  SendVerificationEmailUseCase,
} from "@/domain/ports/in/auth/send-verification-email";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { EmailTokensRepository } from "@/domain/ports/out/database/email-tokens-repository";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import type { EmailSender } from "@/domain/ports/out/email-sender";
import type { Hasher } from "@/domain/ports/out/hasher";
import { BaseUseCase } from "@/shared/classes/base-use-case";
import { randomBytes } from "node:crypto";

const EMAIL_TOKEN_TTL = 24 * 60 * 60_000; // 24h

export type SendVerificationEmailServiceParams<TxCtx extends TxContext<any>> = {
  config: {
    fromEmail: string;
    redirectBaseUrl: string;
  };

  db: Database<TxCtx>;
  emailSender: EmailSender;
  usersRepository: UsersRepository<TxCtx>;
  emailTokensRepository: EmailTokensRepository<TxCtx>;
  hasher: Hasher;
};

export class SendVerificationEmailService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements SendVerificationEmailUseCase
{
  private readonly fromEmail: string;
  private readonly redirectBaseUrl: string;

  private readonly db: Database<TxCtx>;
  private readonly emailSender: EmailSender;
  private readonly usersRepository: UsersRepository<TxCtx>;
  private readonly emailTokensRepository: EmailTokensRepository<TxCtx>;
  private readonly hasher: Hasher;

  constructor(params: SendVerificationEmailServiceParams<TxCtx>) {
    super(SEND_VERIFICATION_EMAIL_USE_CASE);

    this.fromEmail = params.config.fromEmail;
    this.redirectBaseUrl = params.config.redirectBaseUrl;

    this.db = params.db;
    this.emailSender = params.emailSender;
    this.usersRepository = params.usersRepository;
    this.emailTokensRepository = params.emailTokensRepository;
    this.hasher = params.hasher;
  }

  async sendVerificationEmail(
    input: SendVerificationEmailInput,
  ): Promise<void> {
    this.db.beginTx(async (ctx) => {
      const user = await this.usersRepository.getByEmail(ctx, input.email);
      if (!user) {
        return;
      }

      if (user.isEmailVerified) {
        return;
      }

      const token = randomBytes(32).toString("base64url");

      const model: EmailToken = {
        userId: user.id,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + EMAIL_TOKEN_TTL),
        tokenHash: await this.hasher.hash(token),
        usedAt: null,
      };

      await this.emailTokensRepository.save(ctx, model);

      await this.emailSender.sendMail({
        from: `Carevo <${this.fromEmail}>`,
        to: input.email,
        subject: "Verify Your Email",
        text: `Verify your email using link below.\n${this.redirectBaseUrl}/login#${token}`,
      });
    });
  }
}
