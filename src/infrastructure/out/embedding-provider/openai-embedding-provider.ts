import { EMBEDDING_PROVIDER_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type {
  EmbeddingProvider,
  EmbedParams,
  EmbedResult,
} from "@/domain/ports/out/embedding-provider";
import { BaseAdapter } from "@/shared/classes/base-adapter";

export type OpenaiEmbeddingProviderParams = {};

export class OpenaiEmbeddingProvider
  extends BaseAdapter
  implements EmbeddingProvider
{
  constructor(params: OpenaiEmbeddingProviderParams) {
    super(EMBEDDING_PROVIDER_PORT, OUTBOUND_DIRECTION);
  }

  embed(params: EmbedParams): Promise<EmbedResult> {
    throw new Error("not implemented");
  }
}
