import { GET_CV_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import { InfrastructureError } from "@/domain/errors/infrastructure-errors";
import type {
  GetCvInput,
  GetCvOutput,
  GetCvUseCase,
} from "@/domain/ports/in/cvs/get-cv";
import type { CvsRepository } from "@/domain/ports/out/database/cvs-repository";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type GetCvServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  cvsRepository: CvsRepository<TxCtx>;
};

export class GetCvService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GetCvUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly cvsRepository: CvsRepository<TxCtx>;

  constructor(deps: GetCvServiceDeps<TxCtx>) {
    super(GET_CV_USE_CASE);

    this.db = deps.db;
    this.cvsRepository = deps.cvsRepository;
  }

  async getCv(input: GetCvInput): Promise<GetCvOutput> {
    if (input.requestUserId !== input.userId) throw new UnauthorizedError();

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

    return {
      cv,
    };
  }
}
