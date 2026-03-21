import { GET_CERTIFICATIONS_FEED_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import type {
  GetCertificationsFeedInput,
  GetCertificationsFeedOutput,
  GetCertificationsFeedUseCase,
} from "@/domain/ports/in/certifications/get-certifications-feed";
import type { CertificationsRepository } from "@/domain/ports/out/database/certifications-repository";
import type { CvsRepository } from "@/domain/ports/out/database/cvs-repository";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type GetCertificationsFeedServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  cvsRepository: CvsRepository<TxCtx>;
  certificationsRepository: CertificationsRepository<TxCtx>;
};

export class GetCertificationsFeedService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GetCertificationsFeedUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly cvsRepository: CvsRepository<TxCtx>;
  private readonly certificationsRepository: CertificationsRepository<TxCtx>;

  constructor(deps: GetCertificationsFeedServiceDeps<TxCtx>) {
    super(GET_CERTIFICATIONS_FEED_USE_CASE);

    this.db = deps.db;
    this.cvsRepository = deps.cvsRepository;
    this.certificationsRepository = deps.certificationsRepository;
  }

  async getCertificationsFeed(
    input: GetCertificationsFeedInput,
  ): Promise<GetCertificationsFeedOutput> {
    const certifications = await this.db.beginTx(async (ctx) => {
      const embedding = await this.cvsRepository.getEmbedding(
        ctx,
        input.requestUserId,
      );

      return this.certificationsRepository.list(ctx, {
        embedding,
        page: input.page,
        limit: input.limit,
      });
    }, READ_ONLY_DB_TX);

    return {
      certifications,
    };
  }
}
