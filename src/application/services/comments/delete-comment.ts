import { CREATE_COMMENT_USE_CASE } from "@/constants";
import type {
  DeleteCommentInput,
  DeleteCommentUseCase,
} from "@/domain/ports/in/comments/delete-comment";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type DeleteCommentServiceParams<TxCtx extends TxContext<any>> = {};

export class DeleteCommentService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements DeleteCommentUseCase
{
  constructor(params: DeleteCommentServiceParams<TxCtx>) {
    super(CREATE_COMMENT_USE_CASE);
  }

  deleteComment(dto: DeleteCommentInput): Promise<void> {
    throw new Error("not implemented");
  }
}
