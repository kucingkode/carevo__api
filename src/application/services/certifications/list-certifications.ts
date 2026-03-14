import { LIST_CERTIFICATIONS_USE_CASE } from "@/constants";
import type {
  ListCertificationsInput,
  ListCertificationsOutput,
  ListCertificationsUseCase,
} from "@/domain/ports/in/certifications/list-certifications";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type ListCertificationsServiceParams<TxCtx extends TxContext<any>> = {};

export class ListCertificationsService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements ListCertificationsUseCase
{
  constructor(params: ListCertificationsServiceParams<TxCtx>) {
    super(LIST_CERTIFICATIONS_USE_CASE);
  }

  listCertifications(
    dto: ListCertificationsInput,
  ): Promise<ListCertificationsOutput> {
    throw new Error("not implemented");
  }
}
