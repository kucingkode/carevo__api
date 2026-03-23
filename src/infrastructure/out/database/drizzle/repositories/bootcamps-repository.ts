import { BOOTCAMPS_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type {
  BootcampsRepository,
  ListBootcampsQuery,
} from "@/domain/ports/out/database/bootcamps-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";
import type { Bootcamp } from "@/domain/entities/bootcamp";
import { and, cosineDistance, desc, eq, ilike, sql } from "drizzle-orm";
import { bootcamps } from "../schema";
import { getPagination } from "@/shared/utils/pagination";
import { BootcampsRepositoryError } from "@/domain/errors/infrastructure-errors";

export class DrizzleBootcampsRepository
  extends BaseAdapter
  implements BootcampsRepository<DrizzleTxContext>
{
  constructor() {
    super(
      BOOTCAMPS_REPOSITORY_PORT,
      OUTBOUND_DIRECTION,
      BootcampsRepositoryError,
    );
  }

  async list(
    ctx: DrizzleTxContext,
    query: ListBootcampsQuery,
  ): Promise<Bootcamp[]> {
    const { limit, offset } = getPagination(query.page, query.limit);

    const filter = and(
      // query
      query.query ? ilike(bootcamps.name, `%${query.query}%`) : undefined,

      // professionRole
      query.professionRole
        ? eq(bootcamps.professionRole, query.professionRole)
        : undefined,
    );

    const similarBootcamps = await ctx.tx
      .select({
        id: bootcamps.id,
        name: bootcamps.name,
        professionRole: bootcamps.professionRole,
        thumbnailUrl: bootcamps.thumbnailUrl,
        redirectUrl: bootcamps.redirectUrl,
        publisher: bootcamps.publisher,
        startDate: bootcamps.startDate,
        similarity: query.embedding
          ? sql<number>`1 - (${cosineDistance(bootcamps.embedding, query.embedding)})`
          : sql<number>`0`,
        createdAt: bootcamps.createdAt,
      })
      .from(bootcamps)
      .where(filter)
      .orderBy((t) =>
        query.embedding ? desc(t.similarity) : desc(t.startDate),
      )
      .limit(limit)
      .offset(offset);

    return similarBootcamps.map((v) => ({
      id: v.id,
      name: v.name,
      professionRole: v.professionRole,
      publisher: v.publisher,
      redirectUrl: v.redirectUrl,
      startDate: v.startDate,
      thumbnailUrl: v.thumbnailUrl,
      createdAt: v.createdAt,
    }));
  }
}
