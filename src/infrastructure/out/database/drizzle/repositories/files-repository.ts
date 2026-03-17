import { FILES_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type { FilesRepository } from "@/domain/ports/out/database/files-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";

export class DrizzleFilesRepository
  extends BaseAdapter
  implements FilesRepository
{
  constructor() {
    super(FILES_REPOSITORY_PORT, OUTBOUND_DIRECTION);
  }

  insert(ctx: DrizzleTxContext) {}

  delete(ctx: DrizzleTxContext) {}
}
