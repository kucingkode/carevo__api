import { BOOTCAMPS_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type { BootcampsRepository } from "@/domain/ports/out/database/bootcamps-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";

export class DrizzleBootcampsRepository
  extends BaseAdapter
  implements BootcampsRepository
{
  constructor() {
    super(BOOTCAMPS_REPOSITORY_PORT, OUTBOUND_DIRECTION);
  }
}
