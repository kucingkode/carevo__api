import { GET_CERTIFICATIONS_FEED_USE_CASE } from "@/constants";
import type {
  GetCertificationsFeedInput,
  GetCertificationsFeedOutput,
  GetCertificationsFeedUseCase,
} from "@/domain/ports/in/certifications/get-certifications-feed";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type GetCertificationsFeedServiceParams<TxCtx extends TxContext<any>> =
  {};

export class GetCertificationsFeedService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GetCertificationsFeedUseCase
{
  constructor(params: GetCertificationsFeedServiceParams<TxCtx>) {
    super(GET_CERTIFICATIONS_FEED_USE_CASE);
  }

  getCertificationsFeed(
    input: GetCertificationsFeedInput,
  ): Promise<GetCertificationsFeedOutput> {
    throw new Error("not implemented");
  }
}
