import type { Comment } from "@/domain/entities/comment";
import type { TxContext } from "./database";

export type ListCommentsQuery = {
  postId: string;
  parentId?: string;
  page?: number;
  limit?: number;
};

export type CommentsRepository<TxCtx extends TxContext> = {
  getById(ctx: TxCtx, commentId: string): Promise<Comment | undefined>;

  list(ctx: TxCtx, query: ListCommentsQuery): Promise<Comment[]>;

  insert(ctx: TxCtx, comment: Comment): Promise<void>;

  deleteById(ctx: TxCtx, commentId: string): Promise<void>;
};
