import { CREATE_COMMENT_USE_CASE } from "@/constants";
import type {
  CreateCommentInput,
  CreateCommentOutput,
  CreateCommentUseCase,
} from "@/domain/ports/in/comments/create-comment";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type CreateCommentServiceParams<TxCtx extends TxContext<any>> = {};

export class CreateCommentService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements CreateCommentUseCase
{
  constructor(params: CreateCommentServiceParams<TxCtx>) {
    super(CREATE_COMMENT_USE_CASE);
  }

  createComment(dto: CreateCommentInput): Promise<CreateCommentOutput> {
    throw new Error("not implemented");
  }
}
