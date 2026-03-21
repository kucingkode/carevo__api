import type { TxContext } from "./database";

export type UserLikesRepository<TxCtx extends TxContext> = {
  exists(ctx: TxCtx, userId: string, postId: string): Promise<boolean>;

  insert(ctx: TxCtx, userId: string, postId: string): Promise<void>;

  delete(ctx: TxCtx, userId: string, postId: string): Promise<void>;

  countPostLikes(ctx: TxCtx, postId: string): Promise<number>;
};
