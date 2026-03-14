import { DELETE_POST_USE_CASE } from "@/constants";
import type {
  DeletePostInput,
  DeletePostUseCase,
} from "@/domain/ports/in/posts/delete-post";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type DeletePostServiceParams<TxCtx extends TxContext<any>> = {};

export class DeletePostService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements DeletePostUseCase
{
  constructor(params: DeletePostServiceParams<TxCtx>) {
    super(DELETE_POST_USE_CASE);
  }

  deletePost(dto: DeletePostInput): Promise<void> {
    throw new Error("not implemented");
  }
}
