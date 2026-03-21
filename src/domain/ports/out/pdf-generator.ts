export type PdfGenerateOptions = {
  format?: "A4" | "LETTER";
  margin?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  watermark?: {
    text: string;
    angle?: number;
    bold?: boolean;
    color?: string;
    font?: string;
    fontSize?: number;
    italics?: boolean;
    opacity?: number;
  };
};

export type PdfGenerateResult = {
  buffer: Buffer;
  size: number;
};

export type PdfGenerator = {
  generate(
    html: string,
    options?: PdfGenerateOptions,
  ): Promise<PdfGenerateResult>;
};
