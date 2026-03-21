import { GET_BOOTCAMPS_FEED_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import type {
  GetBootcampsFeedInput,
  GetBootcampsFeedOutput,
  GetBootcampsFeedUseCase,
} from "@/domain/ports/in/bootcamps/get-bootcamps-feed";
import type { BootcampsRepository } from "@/domain/ports/out/database/bootcamps-repository";
import type { CvsRepository } from "@/domain/ports/out/database/cvs-repository";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type GetBootcampsFeedServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  cvsRepository: CvsRepository<TxCtx>;
  bootcampsRepository: BootcampsRepository<TxCtx>;
};

export class GetBootcampsFeedService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GetBootcampsFeedUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly cvsRepository: CvsRepository<TxCtx>;
  private readonly bootcampsRepository: BootcampsRepository<TxCtx>;

  constructor(deps: GetBootcampsFeedServiceDeps<TxCtx>) {
    super(GET_BOOTCAMPS_FEED_USE_CASE);

    this.db = deps.db;
    this.cvsRepository = deps.cvsRepository;
    this.bootcampsRepository = deps.bootcampsRepository;
  }

  async getBootcampsFeed(
    input: GetBootcampsFeedInput,
  ): Promise<GetBootcampsFeedOutput> {
    const bootcamps = await this.db.beginTx(async (ctx) => {
      const embedding = await this.cvsRepository.getEmbedding(
        ctx,
        input.requestUserId,
      );

      return this.bootcampsRepository.list(ctx, {
        embedding,
        page: input.page,
        limit: input.limit,
      });
    }, READ_ONLY_DB_TX);

    return {
      bootcamps,
    };
  }
}
