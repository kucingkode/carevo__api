import { READ_ONLY_DB_TX, UPDATE_CV_EMBEDDING_USE_CASE } from "@/constants";
import { InfrastructureError } from "@/domain/errors/infrastructure-errors";
import type {
  UpdateCvEmbeddingInput,
  UpdateCvEmbeddingUseCase,
} from "@/domain/ports/in/cvs/update-cv-embedding";
import type { CvsRepository } from "@/domain/ports/out/database/cvs-repository";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { EmbeddingProvider } from "@/domain/ports/out/embedding-provider";
import { BaseUseCase } from "@/shared/classes/base-use-case";

const EMBEDDING_MODEL = "text-embedding-3-small";

export type UpdateCvEmbeddingDeps<TxCtx extends TxContext> = {
  db: Database<TxCtx>;
  cvsRepository: CvsRepository<TxCtx>;
  embeddingProvider: EmbeddingProvider;
};

export class UpdateCvEmbeddingService<TxCtx extends TxContext>
  extends BaseUseCase
  implements UpdateCvEmbeddingUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly cvsRepository: CvsRepository<TxCtx>;
  private readonly embeddingProvider: EmbeddingProvider;

  constructor(deps: UpdateCvEmbeddingDeps<TxCtx>) {
    super(UPDATE_CV_EMBEDDING_USE_CASE);

    this.db = deps.db;
    this.cvsRepository = deps.cvsRepository;
    this.embeddingProvider = deps.embeddingProvider;
  }

  async updateCvEmbedding(input: UpdateCvEmbeddingInput): Promise<void> {
    const cv = await this.db.beginTx(
      (ctx) => this.cvsRepository.getByUserId(ctx, input.userId),
      READ_ONLY_DB_TX,
    );

    if (!cv) {
      this.log.error(
        { userId: input.userId },
        "Data integrity violation: valid user exists without cv",
      );

      throw new InfrastructureError("Data integrity violation");
    }

    const embedding = await this.embeddingProvider.embed({
      input: cv.getSummary(),
      model: EMBEDDING_MODEL,
    });

    await this.db.beginTx((ctx) =>
      this.cvsRepository.saveEmbedding(ctx, cv.userId, embedding.embeddings[0]),
    );

    this.log.info({ userId: input.userId }, "CV embedding updated");
  }
}
