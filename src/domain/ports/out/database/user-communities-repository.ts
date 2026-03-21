import type { TxContext } from "./database";

export type UserCommunitiesRepository<TxCtx extends TxContext> = {
  listByUserId(ctx: TxCtx, userId: string): Promise<string[]>;

  insert(ctx: TxCtx, userId: string, communityId: string): Promise<void>;

  delete(ctx: TxCtx, userId: string, communityId: string): Promise<void>;
};
