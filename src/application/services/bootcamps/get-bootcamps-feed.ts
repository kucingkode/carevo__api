import { GET_BOOTCAMPS_FEED_USE_CASE } from "@/constants";
import type {
  GetBootcampsFeedInput,
  GetBootcampsFeedOutput,
  GetBootcampsFeedUseCase,
} from "@/domain/ports/in/bootcamps/get-bootcamps-feed";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type GetBootcampsFeedServiceParams<TxCtx extends TxContext<any>> = {};

export class GetBootcampsFeedService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GetBootcampsFeedUseCase
{
  constructor(params: GetBootcampsFeedServiceParams<TxCtx>) {
    super(GET_BOOTCAMPS_FEED_USE_CASE);
  }

  getBootcampsFeed(
    dto: GetBootcampsFeedInput,
  ): Promise<GetBootcampsFeedOutput> {
    throw new Error("not implemented");
  }
}
