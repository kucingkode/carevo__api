import type { Bootcamp } from "@/domain/entities/bootcamp";
import type { TxContext } from "./database";

export type ListBootcampsQuery = {
  query?: string;
  embedding?: number[];
  professionRole?: string;
  page?: number;
  limit?: number;
};

export type BootcampsRepository<TxCtx extends TxContext> = {
  list(ctx: TxCtx, query: ListBootcampsQuery): Promise<Bootcamp[]>;
};
