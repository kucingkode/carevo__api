import { COMMENTS_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type { CommunitiesRepository } from "@/domain/ports/out/database/communities-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";

export class DrizzleCommunitiesRepository
  extends BaseAdapter
  implements CommunitiesRepository
{
  constructor() {
    super(COMMENTS_REPOSITORY_PORT, OUTBOUND_DIRECTION);
  }
}
