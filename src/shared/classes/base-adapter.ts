import type { Logger } from "@/observability/logging";
import { createAdapterLogger } from "../utils/create-adapter-logger";
import { InfrastructureError } from "@/domain/errors/infrastructure-errors";
import { DomainError } from "@/domain/errors/domain/domain-error";
import { onError } from "../utils/on-error";

export class BaseAdapter {
  protected readonly log: Logger;
  protected readonly AdapterError: typeof InfrastructureError;

  constructor(
    port: string,
    direction: string,
    AdapterError: typeof InfrastructureError,
  ) {
    this.log = createAdapterLogger(this.constructor.name, port, direction);
    this.AdapterError = AdapterError;
  }

  protected async call<T>(
    fn: () => Promise<T> | T,
    msg: string,
    mapError?: (err: unknown) => Error | undefined,
  ) {
    return onError(fn, (err) => {
      const mapped = mapError?.(err);
      if (mapped) throw mapped;

      throw new this.AdapterError(msg, {
        cause: err,
      });
    });
  }
}
