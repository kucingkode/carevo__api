import type { Certification } from "@/domain/entities/certification";
import type { TxContext } from "./database";

export type ListCertificationsQuery = {
  query?: string;
  embedding?: number[];
  professionRole?: string;
  page?: number;
  limit?: number;
};

export type CertificationsRepository<TxCtx extends TxContext> = {
  list(ctx: TxCtx, query: ListCertificationsQuery): Promise<Certification[]>;
};
