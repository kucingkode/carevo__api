import { LLM_PROVIDER_PORT, OUTBOUND_DIRECTION } from "@/constants";
import { LlmProviderError } from "@/domain/errors/infrastructure-errors";
import type {
  LlmGenerateParams,
  LlmProvider,
} from "@/domain/ports/out/llm-provider";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import OpenAI from "openai";

export type OpenaiLlmProviderConfig = {
  apiKey: string;
};

export class OpenaiLlmProvider extends BaseAdapter implements LlmProvider {
  private readonly openai: OpenAI;

  constructor(config: OpenaiLlmProviderConfig) {
    super(LLM_PROVIDER_PORT, OUTBOUND_DIRECTION, LlmProviderError);

    this.openai = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  async *generate(params: LlmGenerateParams): AsyncIterable<string> {
    const stream = await this.call(
      () =>
        this.openai.chat.completions.create({
          model: params.model,
          messages: params.messages,
          max_completion_tokens: params.maxTokens,
          temperature: params.temperature,
          stream: true,
        }),
      "generate: Chat completion creation failed",
    );

    for await (const chunk of stream) {
      const msgChunk = chunk.choices[0]?.delta?.content || "";
      if (msgChunk) {
        yield msgChunk;
      }
    }
  }
}
