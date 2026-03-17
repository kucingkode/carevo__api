import {
  CERTIFICATIONS_REPOSITORY_PORT,
  OUTBOUND_DIRECTION,
} from "@/constants";
import type { CertificationsRepository } from "@/domain/ports/out/database/certifications-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";

export class DrizzleCertificationsRepository
  extends BaseAdapter
  implements CertificationsRepository
{
  constructor() {
    super(CERTIFICATIONS_REPOSITORY_PORT, OUTBOUND_DIRECTION);
  }

  rank(ctx: DrizzleTxContext, userId: string) {}
}
