import { DOWNLOAD_CV_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import { InfrastructureError } from "@/domain/errors/infrastructure-errors";
import type {
  RenderCvInput,
  RenderCvOutput,
  RenderCvUseCase,
} from "@/domain/ports/in/cvs/render-cv";
import type { CvsRepository } from "@/domain/ports/out/database/cvs-repository";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { PdfGenerator } from "@/domain/ports/out/pdf-generator";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type RenderCvServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  cvsRepository: CvsRepository<TxCtx>;
  pdfGenerator: PdfGenerator;
};

export class RenderCvService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements RenderCvUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly cvsRepository: CvsRepository<TxCtx>;
  private readonly pdfGenerator: PdfGenerator;

  constructor(deps: RenderCvServiceDeps<TxCtx>) {
    super(DOWNLOAD_CV_USE_CASE);

    this.db = deps.db;
    this.cvsRepository = deps.cvsRepository;
    this.pdfGenerator = deps.pdfGenerator;
  }

  async renderCv(input: RenderCvInput): Promise<RenderCvOutput> {
    if (input.requestUserId !== input.userId && !input.preview)
      throw new UnauthorizedError();

    const cv = await this.db.beginTx(
      (ctx) => this.cvsRepository.getByUserId(ctx, input.userId),
      READ_ONLY_DB_TX,
    );

    if (!cv) {
      this.log.error(
        { userId: input.userId },
        "Data integrity violation: valid user exists without CV",
      );
      throw new InfrastructureError("Data integrity violation");
    }

    const html = cv.renderHtml();

    const pdf = await this.pdfGenerator.generate(html, {
      format: "A4",
      watermark: input.preview
        ? {
            text: "PREVIEW",
            bold: true,
            fontSize: 64,
            opacity: 0.1,
          }
        : undefined,
    });

    return {
      buffer: pdf.buffer,
    };
  }
}
