import { COMMENTS_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type {
  CommunitiesRepository,
  ListCommunitiesQuery,
} from "@/domain/ports/out/database/communities-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";
import { CommunitiesRepositoryError } from "@/domain/errors/infrastructure-errors";
import type { Community } from "@/domain/entities/community";
import { getPagination } from "@/shared/utils/pagination";
import { and, eq, like, or } from "drizzle-orm";
import { communities } from "../schema";

export class DrizzleCommunitiesRepository
  extends BaseAdapter
  implements CommunitiesRepository<DrizzleTxContext>
{
  constructor() {
    super(
      COMMENTS_REPOSITORY_PORT,
      OUTBOUND_DIRECTION,
      CommunitiesRepositoryError,
    );
  }

  async list(
    ctx: DrizzleTxContext,
    query: ListCommunitiesQuery,
  ): Promise<Community[]> {
    const { limit, offset } = getPagination(query.page, query.limit);

    const filter = and(
      query.query ? like(communities.name, `%${query.query}%`) : undefined,
    );

    const result = await ctx.tx.query.communities.findMany({
      where: filter,
      limit,
      offset,
      orderBy: communities.name,
    });

    return result;
  }
}
