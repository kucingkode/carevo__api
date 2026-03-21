import type { Community } from "@/domain/entities/community";
import type { TxContext } from "./database";

export type ListCommunitiesQuery = {
  query?: string;
  page?: number;
  limit?: number;
};

export type CommunitiesRepository<TxCtx extends TxContext> = {
  list(ctx: TxCtx, query: ListCommunitiesQuery): Promise<Community[]>;
};
