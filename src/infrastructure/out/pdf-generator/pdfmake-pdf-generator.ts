import { PDF_GENERATOR_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type {
  PdfGenerateParams,
  PdfGenerateResult,
  PdfGenerator,
} from "@/domain/ports/out/pdf-generator";
import { BaseAdapter } from "@/shared/classes/base-adapter";

export type PdfGeneratorParams = {};

export class PdfmakePdfGenerator extends BaseAdapter implements PdfGenerator {
  constructor(params: PdfGeneratorParams) {
    super(PDF_GENERATOR_PORT, OUTBOUND_DIRECTION);
  }

  generate(params: PdfGenerateParams): Promise<PdfGenerateResult> {
    throw new Error("not implemented");
  }
}
