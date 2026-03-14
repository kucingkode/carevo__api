import { DELETE_POST_LIKE_USE_CASE } from "@/constants";
import type {
  DeletePostLikeInput,
  DeletePostLikeUseCase,
} from "@/domain/ports/in/posts/delete-post-like";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type DeletePostLikeServiceParams<TxCtx extends TxContext<any>> = {};

export class DeletePostLikeService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements DeletePostLikeUseCase
{
  constructor(params: DeletePostLikeServiceParams<TxCtx>) {
    super(DELETE_POST_LIKE_USE_CASE);
  }

  deletePostLike(input: DeletePostLikeInput): Promise<void> {
    throw new Error("not implemented");
  }
}
