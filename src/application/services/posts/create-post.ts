import { CREATE_POST_USE_CASE } from "@/constants";
import type {
  CreatePostInput,
  CreatePostOutput,
  CreatePostUseCase,
} from "@/domain/ports/in/posts/create-post";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type CreatePostServiceParams<TxCtx extends TxContext<any>> = {};

export class CreatePostService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements CreatePostUseCase
{
  constructor(params: CreatePostServiceParams<TxCtx>) {
    super(CREATE_POST_USE_CASE);
  }

  createPost(dto: CreatePostInput): Promise<CreatePostOutput> {
    throw new Error("not implemented");
  }
}
