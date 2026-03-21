import type { EmailToken } from "@/domain/entities/email-token";

export type EmailTokensRepository<TxCtx> = {
  getByUserId(ctx: TxCtx, userId: string): Promise<EmailToken | undefined>;
  save(ctx: TxCtx, token: EmailToken): Promise<void>;
};
