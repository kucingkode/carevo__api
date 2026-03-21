import { LIST_BOOTCAMPS_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import type {
  ListBootcampsInput,
  ListBootcampsOutput,
  ListBootcampsUseCase,
} from "@/domain/ports/in/bootcamps/list-bootcamps";
import type { BootcampsRepository } from "@/domain/ports/out/database/bootcamps-repository";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type ListBootcampsServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  bootcampsRepository: BootcampsRepository<TxCtx>;
};

export class ListBootcampsService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements ListBootcampsUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly bootcampsRepository: BootcampsRepository<TxCtx>;

  constructor(deps: ListBootcampsServiceDeps<TxCtx>) {
    super(LIST_BOOTCAMPS_USE_CASE);

    this.db = deps.db;
    this.bootcampsRepository = deps.bootcampsRepository;
  }

  async listBootcamps(input: ListBootcampsInput): Promise<ListBootcampsOutput> {
    const bootcamps = await this.db.beginTx(
      (ctx) =>
        this.bootcampsRepository.list(ctx, {
          query: input.query,
          professionRole: input.professionRole,
          page: input.page,
          limit: input.limit,
        }),
      READ_ONLY_DB_TX,
    );

    return {
      bootcamps,
    };
  }
}
