export type PdfGenerateParams = {
  html: string;
  options?: {
    format?: "A4" | "Letter";
    margin?: {
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
    };
  };
};

export type PdfGenerateResult = {
  buffer: Buffer;
  size: number;
};

export type PdfGenerator = {
  generate(params: PdfGenerateParams): Promise<PdfGenerateResult>;
};
