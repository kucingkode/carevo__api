import { READ_ONLY_DB_TX, SEND_VERIFICATION_EMAIL_USE_CASE } from "@/constants";
import { EmailToken } from "@/domain/entities/email-token";
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
import { stringifyToken } from "@/shared/utils/token-format";
import { randomBytes } from "node:crypto";

export type SendVerificationEmailServiceConfig = {
  fromEmail: string;
  redirectBaseUrl: string;
};

export type SendVerificationEmailServiceDeps<TxCtx extends TxContext<any>> = {
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
  private readonly db: Database<TxCtx>;
  private readonly emailSender: EmailSender;
  private readonly usersRepository: UsersRepository<TxCtx>;
  private readonly emailTokensRepository: EmailTokensRepository<TxCtx>;
  private readonly hasher: Hasher;

  constructor(
    private readonly config: SendVerificationEmailServiceConfig,
    deps: SendVerificationEmailServiceDeps<TxCtx>,
  ) {
    super(SEND_VERIFICATION_EMAIL_USE_CASE);

    this.db = deps.db;
    this.emailSender = deps.emailSender;
    this.usersRepository = deps.usersRepository;
    this.emailTokensRepository = deps.emailTokensRepository;
    this.hasher = deps.hasher;
  }

  async sendVerificationEmail(
    input: SendVerificationEmailInput,
  ): Promise<void> {
    const logCtx: any = {
      email: input.email,
      ipAddress: input.ipAddress,
    };

    // get user
    const user = await this.db.beginTx(async (ctx) => {
      return this.usersRepository.getByEmail(ctx, input.email);
    }, READ_ONLY_DB_TX);

    // silent fail for verified user
    if (!user) {
      this.log.warn(
        logCtx,
        "Verification email request failed: user not found",
      );
      return;
    }

    if (user.isEmailVerified) {
      this.log.warn(
        logCtx,
        "Verification email request failed: verified email",
      );
      return;
    }

    // send token
    const secret = randomBytes(32).toString("base64url");

    const model: EmailToken = EmailToken.create({
      userId: user.id,
      tokenHash: await this.hasher.hash(secret),
    });

    const token = stringifyToken(model.userId, secret);

    await this.db.beginTx(async (ctx) => {
      await this.emailTokensRepository.save(ctx, model);

      await this.emailSender.sendMail({
        from: `Carevo <${this.config.fromEmail}>`,
        to: input.email,
        subject: "Verifikasi Email Anda",
        text: `Verifikasi email Anda dengan tautan berikut.\n${this.config.redirectBaseUrl}/auth/login#${token}`,
      });
    });

    this.log.info(logCtx, "Verification email sent");
  }
}
