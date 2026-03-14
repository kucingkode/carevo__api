import { LLM_PROVIDER_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type {
  LlmGenerateParams,
  LlmProvider,
} from "@/domain/ports/out/llm-provider";
import { BaseAdapter } from "@/shared/classes/base-adapter";

export type OpenaiLlmProviderParams = {};

export class OpenaiLlmProvider extends BaseAdapter implements LlmProvider {
  constructor(params: OpenaiLlmProviderParams) {
    super(LLM_PROVIDER_PORT, OUTBOUND_DIRECTION);
  }

  generate(params: LlmGenerateParams): AsyncIterable<string> {
    throw new Error("not implemented");
  }
}
