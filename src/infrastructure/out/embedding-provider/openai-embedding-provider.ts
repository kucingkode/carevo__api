import { EMBEDDING_PROVIDER_PORT, OUTBOUND_DIRECTION } from "@/constants";
import { EmbeddingProviderError } from "@/domain/errors/infrastructure-errors";
import type {
  EmbeddingProvider,
  EmbedParams,
  EmbedResult,
} from "@/domain/ports/out/embedding-provider";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import OpenAI from "openai";

export type OpenaiEmbeddingProviderConfig = {
  apiKey: string;
};

export class OpenaiEmbeddingProvider
  extends BaseAdapter
  implements EmbeddingProvider
{
  private readonly openai: OpenAI;

  constructor(config: OpenaiEmbeddingProviderConfig) {
    super(EMBEDDING_PROVIDER_PORT, OUTBOUND_DIRECTION, EmbeddingProviderError);

    this.openai = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  async embed(params: EmbedParams): Promise<EmbedResult> {
    const { data, usage } = await this.call(
      () =>
        this.openai.embeddings.create({
          input: params.input,
          model: params.model ?? "text-embedding-3-small",
        }),
      "embed: embedidng creation request failed",
    );

    const totalTokens = usage.total_tokens;

    this.log.debug({ model: params.model, totalTokens }, "Embedding created");

    return {
      embeddings: data
        .sort((a, b) => a.index - b.index)
        .map((v) => v.embedding),
      totalTokens,
    };
  }
}
