import { POSTS_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type { PostsRepository } from "@/domain/ports/out/database/posts-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";

export class DrizzlePostsRepository
  extends BaseAdapter
  implements PostsRepository
{
  constructor() {
    super(POSTS_REPOSITORY_PORT, OUTBOUND_DIRECTION);
  }
}
