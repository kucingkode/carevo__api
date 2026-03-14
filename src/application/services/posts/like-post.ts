import { LIKE_POST_USE_CASE } from "@/constants";
import type {
  LikePostInput,
  LikePostUseCase,
} from "@/domain/ports/in/posts/like-post";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type LikePostServiceParams<TxCtx extends TxContext<any>> = {};

export class LikePostService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements LikePostUseCase
{
  constructor(params: LikePostServiceParams<TxCtx>) {
    super(LIKE_POST_USE_CASE);
  }

  likePost(dto: LikePostInput): Promise<void> {
    throw new Error("not implemented");
  }
}
