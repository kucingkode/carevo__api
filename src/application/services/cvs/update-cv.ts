import { UPDATE_CV_USE_CASE } from "@/constants";
import { ForbiddenError } from "@/domain/errors/domain/forbidden-error";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import type {
  UpdateCvInput,
  UpdateCvUseCase,
} from "@/domain/ports/in/cvs/update-cv";
import type { CvsRepository } from "@/domain/ports/out/database/cvs-repository";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type UpdateCvServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  cvsRepository: CvsRepository<TxCtx>;
};

export class UpdateCvService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements UpdateCvUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly cvsRepository: CvsRepository<TxCtx>;

  constructor(deps: UpdateCvServiceDeps<TxCtx>) {
    super(UPDATE_CV_USE_CASE);

    this.db = deps.db;
    this.cvsRepository = deps.cvsRepository;
  }

  async updateCv(input: UpdateCvInput): Promise<void> {
    if (input.requestUserId !== input.userId) throw new ForbiddenError();

    await this.db.beginTx((ctx) =>
      this.cvsRepository.partialUpdate(ctx, input.userId, input.partialCv),
    );
  }
}
