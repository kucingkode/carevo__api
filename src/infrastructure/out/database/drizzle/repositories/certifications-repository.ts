import { BOOTCAMPS_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type {
  CertificationsRepository,
  ListCertificationsQuery,
} from "@/domain/ports/out/database/certifications-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";
import type { Certification } from "@/domain/entities/certification";
import { and, cosineDistance, desc, eq, like, sql } from "drizzle-orm";
import { certifications } from "../schema";
import { getPagination } from "@/shared/utils/pagination";
import { CertificationsRepositoryError } from "@/domain/errors/infrastructure-errors";

export class DrizzleCertificationsRepository
  extends BaseAdapter
  implements CertificationsRepository<DrizzleTxContext>
{
  constructor() {
    super(
      BOOTCAMPS_REPOSITORY_PORT,
      OUTBOUND_DIRECTION,
      CertificationsRepositoryError,
    );
  }

  async list(
    ctx: DrizzleTxContext,
    query: ListCertificationsQuery,
  ): Promise<Certification[]> {
    const { limit, offset } = getPagination(query.page, query.limit);

    const filter = and(
      // query
      query.query ? like(certifications.name, `%${query.query}%`) : undefined,

      // professionRole
      query.professionRole
        ? eq(certifications.professionRole, query.professionRole)
        : undefined,
    );

    const similarCertifications = await ctx.tx
      .select({
        id: certifications.id,
        name: certifications.name,
        professionRole: certifications.professionRole,
        thumbnailUrl: certifications.thumbnailUrl,
        redirectUrl: certifications.redirectUrl,
        publisher: certifications.publisher,
        similarity: query.embedding
          ? sql<number>`1 - (${cosineDistance(certifications.embedding, query.embedding)})`
          : sql<number>`0`,
        createdAt: certifications.createdAt,
      })
      .from(certifications)
      .orderBy((t) =>
        query.embedding ? desc(t.similarity) : desc(t.createdAt),
      )
      .where(filter)
      .offset(offset)
      .limit(limit);

    return similarCertifications.map((v) => ({
      id: v.id,
      name: v.name,
      professionRole: v.professionRole,
      publisher: v.publisher,
      redirectUrl: v.redirectUrl,
      thumbnailUrl: v.thumbnailUrl,
      createdAt: v.createdAt,
    }));
  }
}
