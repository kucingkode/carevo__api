import { LIST_CERTIFICATIONS_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import type {
  ListCertificationsInput,
  ListCertificationsOutput,
  ListCertificationsUseCase,
} from "@/domain/ports/in/certifications/list-certifications";
import type { CertificationsRepository } from "@/domain/ports/out/database/certifications-repository";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type ListCertificationsServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  certificationsRepository: CertificationsRepository<TxCtx>;
};

export class ListCertificationsService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements ListCertificationsUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly certificationsRepository: CertificationsRepository<TxCtx>;

  constructor(deps: ListCertificationsServiceDeps<TxCtx>) {
    super(LIST_CERTIFICATIONS_USE_CASE);

    this.db = deps.db;
    this.certificationsRepository = deps.certificationsRepository;
  }

  async listCertifications(
    input: ListCertificationsInput,
  ): Promise<ListCertificationsOutput> {
    const certifications = await this.db.beginTx(
      (ctx) =>
        this.certificationsRepository.list(ctx, {
          query: input.query,
          professionRole: input.professionRole,
          page: input.page,
          limit: input.limit,
        }),
      READ_ONLY_DB_TX,
    );

    return {
      certifications,
    };
  }
}
