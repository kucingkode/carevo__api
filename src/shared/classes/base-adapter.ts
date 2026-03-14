import type { Logger } from "@/observability/logging";
import { createAdapterLogger } from "../utils/create-adapter-logger";

export class BaseAdapter {
  protected readonly log: Logger;

  constructor(port: string, direction: string) {
    this.log = createAdapterLogger(this.constructor.name, port, direction);
  }
}
