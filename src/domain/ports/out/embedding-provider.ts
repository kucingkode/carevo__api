export type EmbedParams = {
  input: string | string[];
  model?: string;
};

export type EmbedResult = {
  embeddings: number[][];
  dimensions: number;
  inputTokens: number;
};

export type EmbeddingProvider = {
  embed(params: EmbedParams): Promise<EmbedResult>;
};
