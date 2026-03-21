export type LlmMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LlmGenerateParams = {
  messages: LlmMessage[];
  model: string;
  maxTokens?: number;
  temperature?: number;
};

export type LlmProvider = {
  generate(params: LlmGenerateParams): AsyncIterable<string>;
};
