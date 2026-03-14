import { CVS_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type { CvsRepository } from "@/domain/ports/out/database/cvs-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";

export class DrizzleCvsRepository extends BaseAdapter implements CvsRepository {
  constructor() {
    super(CVS_REPOSITORY_PORT, OUTBOUND_DIRECTION);
  }
}
