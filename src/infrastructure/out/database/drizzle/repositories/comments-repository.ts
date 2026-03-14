import { COMMENTS_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type { CommentsRepository } from "@/domain/ports/out/database/comments-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";

export class DrizzleCommentsRepository
  extends BaseAdapter
  implements CommentsRepository
{
  constructor() {
    super(COMMENTS_REPOSITORY_PORT, OUTBOUND_DIRECTION);
  }
}
