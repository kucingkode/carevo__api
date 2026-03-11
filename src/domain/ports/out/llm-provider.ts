export type LlmMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LlmGenerateParams = {
  messages: LlmMessage[];
  maxTokens?: number;
  temperature?: number;
};

export type LlmProvider = {
  generate(params: LlmGenerateParams): AsyncIterable<string>;
};
