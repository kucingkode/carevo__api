import { VERIFY_USER_EMAIL_USE_CASE } from "@/constants";
import type {
  VerifyUserEmailInput,
  VerifyUserEmailUseCase,
} from "@/domain/ports/in/auth/verify-user-email";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { EmailTokensRepository } from "@/domain/ports/out/database/email-tokens-repository";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import type { Hasher } from "@/domain/ports/out/hasher";
import { BaseUseCase } from "@/shared/classes/base-use-case";
import { randomBytes } from "node:crypto";

export type VerifyUserEmailServiceParams<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  usersRepository: UsersRepository<TxCtx>;
  emailTokensRepository: EmailTokensRepository<TxCtx>;
  hasher: Hasher;
};

export class VerifyUserEmailService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements VerifyUserEmailUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly usersRepository: UsersRepository<TxCtx>;
  private readonly emailTokensRepository: EmailTokensRepository<TxCtx>;
  private readonly hasher: Hasher;

  constructor(params: VerifyUserEmailServiceParams<TxCtx>) {
    super(VERIFY_USER_EMAIL_USE_CASE);

    this.db = params.db;
    this.usersRepository = params.usersRepository;
    this.emailTokensRepository = params.emailTokensRepository;
    this.hasher = params.hasher;
  }

  async verifyUserEmail(input: VerifyUserEmailInput): Promise<void> {
    this.db.beginTx(async (ctx) => {
      const user = await this.usersRepository.getByEmail(ctx, input.email);
      if (!user) {
        return;
      }
    });
  }
}
