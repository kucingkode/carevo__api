import type { Cv, CvPartialUpdate } from "@/domain/entities/cv";
import type { TxContext } from "./database";

export type CvsRepository<TxCtx extends TxContext> = {
  getByUserId(ctx: TxCtx, userId: string): Promise<Cv | undefined>;

  partialUpdate(
    ctx: TxCtx,
    userId: string,
    partialCv: CvPartialUpdate,
  ): Promise<void>;

  insert(ctx: TxCtx, cv: Cv): Promise<void>;

  getEmbedding(ctx: TxCtx, userId: string): Promise<number[] | undefined>;

  saveEmbedding(ctx: TxCtx, userId: string, embedding: number[]): Promise<void>;
};
