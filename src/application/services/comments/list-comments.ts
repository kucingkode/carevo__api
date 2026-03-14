import { LIST_COMMENTS_USE_CASE } from "@/constants";
import type {
  ListCommentsInput,
  ListCommentsOutput,
  ListCommentsUseCase,
} from "@/domain/ports/in/comments/list-comments";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type ListCommentsServiceParams<TxCtx extends TxContext<any>> = {};

export class ListCommentsService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements ListCommentsUseCase
{
  constructor(params: ListCommentsServiceParams<TxCtx>) {
    super(LIST_COMMENTS_USE_CASE);
  }

  listComments(dto: ListCommentsInput): Promise<ListCommentsOutput> {
    throw new Error("not implemented");
  }
}
