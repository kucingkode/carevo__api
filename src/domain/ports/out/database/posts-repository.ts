import type { Post } from "@/domain/entities/post";
import type { TxContext } from "./database";

export type ListPostsQuery = {
  communityIds?: string[];
  page?: number;
  limit?: number;
};

export type PostsRepository<TxCtx extends TxContext> = {
  getById(ctx: TxCtx, postId: string): Promise<Post | undefined>;

  list(ctx: TxCtx, query: ListPostsQuery): Promise<Post[]>;

  insert(ctx: TxCtx, post: Post): Promise<void>;

  deleteById(ctx: TxCtx, postId: string): Promise<void>;
};
