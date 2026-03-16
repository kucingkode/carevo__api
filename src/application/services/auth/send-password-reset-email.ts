import {
  READ_ONLY_DB_TX,
  SEND_PASSWORD_RESET_EMAIL_USE_CASE,
} from "@/constants";
import { PasswordToken } from "@/domain/entities/password-token";
import type {
  SendPasswordResetEmailInput,
  SendPasswordResetEmailUseCase,
} from "@/domain/ports/in/auth/send-password-reset-email";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { PasswordTokensRepository } from "@/domain/ports/out/database/password-tokens-repository";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import type { EmailSender } from "@/domain/ports/out/email-sender";
import type { Hasher } from "@/domain/ports/out/hasher";
import { BaseUseCase } from "@/shared/classes/base-use-case";
import { stringifyToken } from "@/shared/utils/token-format";
import { randomBytes } from "node:crypto";

export type SendPasswordResetEmailServiceConfig = {
  fromEmail: string;
  redirectBaseUrl: string;
};

export type SendPasswordResetEmailServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  emailSender: EmailSender;
  usersRepository: UsersRepository<TxCtx>;
  passwordTokensRepository: PasswordTokensRepository<TxCtx>;
  hasher: Hasher;
};

export class SendPasswordResetEmailService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements SendPasswordResetEmailUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly emailSender: EmailSender;
  private readonly usersRepository: UsersRepository<TxCtx>;
  private readonly passwordTokensRepository: PasswordTokensRepository<TxCtx>;
  private readonly hasher: Hasher;

  constructor(
    private readonly config: SendPasswordResetEmailServiceConfig,
    deps: SendPasswordResetEmailServiceDeps<TxCtx>,
  ) {
    super(SEND_PASSWORD_RESET_EMAIL_USE_CASE);
    this.db = deps.db;
    this.emailSender = deps.emailSender;
    this.usersRepository = deps.usersRepository;
    this.passwordTokensRepository = deps.passwordTokensRepository;
    this.hasher = deps.hasher;
  }

  async sendPasswordResetEmail(
    input: SendPasswordResetEmailInput,
  ): Promise<void> {
    const logCtx: any = {
      email: input.email,
      ipAddress: input.ipAddress,
    };

    // get user
    const user = await this.db.beginTx(async (ctx) => {
      return this.usersRepository.getByEmail(ctx, input.email);
    }, READ_ONLY_DB_TX);

    // silent fail for unverified or no password account
    if (!user) {
      this.log.warn(
        logCtx,
        "Password reset email request failed: user not found",
      );
      return;
    }

    if (!user.isEmailVerified) {
      this.log.warn(
        logCtx,
        "Password reset email request failed: unverified email",
      );
      return;
    }

    if (!user.passwordHash) {
      this.log.warn(
        logCtx,
        "Password reset email request failed: OAuth-only user",
      );
      return;
    }

    // send token
    const secret = randomBytes(32).toString("base64url");

    const model: PasswordToken = PasswordToken.create({
      userId: user.id,
      tokenHash: await this.hasher.hash(secret),
    });

    const token = stringifyToken(model.userId, secret);

    this.db.beginTx(async (ctx) => {
      await this.passwordTokensRepository.save(ctx, model);

      await this.emailSender.sendMail({
        from: `Carevo <${this.config.fromEmail}>`,
        to: input.email,
        subject: "Reset Password Anda",
        text: `Reset password Anda dengan tautan berikut.\n${this.config.redirectBaseUrl}/auth/reset-password#${token}`,
      });
    });

    this.log.info(logCtx, "Password reset email sent");
  }
}
