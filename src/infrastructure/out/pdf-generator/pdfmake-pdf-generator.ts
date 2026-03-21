import {
  PDF_GENERATOR_PORT,
  OUTBOUND_DIRECTION,
  PDFMAKE_FONTS,
} from "@/constants";
import { PdfGeneratorError } from "@/domain/errors/infrastructure-errors";
import type {
  PdfGenerateOptions,
  PdfGenerateResult,
  PdfGenerator,
} from "@/domain/ports/out/pdf-generator";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import htmlToPdfmake from "html-to-pdfmake";
import type { DOMWindow } from "jsdom";
import { JSDOM } from "jsdom";
import pdfmake from "pdfmake";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

pdfmake.addFonts(PDFMAKE_FONTS);

// @ts-ignore
pdfmake.setUrlAccessPolicy((url) => {
  return url.startsWith("https://");
});

export type PdfGeneratorConfig = {};

export class PdfmakePdfGenerator extends BaseAdapter implements PdfGenerator {
  private readonly window: DOMWindow;

  constructor(config: PdfGeneratorConfig) {
    super(PDF_GENERATOR_PORT, OUTBOUND_DIRECTION, PdfGeneratorError);
    this.window = new JSDOM("").window;
  }

  async generate(
    html: string,
    options: PdfGenerateOptions,
  ): Promise<PdfGenerateResult> {
    const converted = await this.call(
      () =>
        htmlToPdfmake(html, {
          window: this.window as any,
          defaultStyles: {
            // @ts-ignore
            a: { decoration: null },
          },
        }),
      "generate: HTML to pdfmake conversion failed",
    );

    const docDefinition: TDocumentDefinitions = {
      content: converted,
      pageSize: options.format,
      defaultStyle: {
        font: "Inter",
      },
      styles: {
        boldText: {
          bold: true,
        },
      },
      watermark: options.watermark,
    };

    if (options.margin) {
      const { left, top, right, bottom } = options.margin;
      docDefinition.pageMargins = [left, top, right, bottom];
    }

    const buffer = await this.call(
      () => pdfmake.createPdf(docDefinition).getBuffer(),
      "generate: PDF creation failed",
    );

    return {
      buffer,
      size: buffer.length,
    };
  }
}
