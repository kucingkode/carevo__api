import { CACHE_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type { Cache } from "@/domain/ports/out/cache";
import { BaseAdapter } from "@/shared/classes/base-adapter";

export type MemoryCacheParams = {};

export class MemoryCache extends BaseAdapter implements Cache {
  constructor(params: MemoryCacheParams) {
    super(CACHE_PORT, OUTBOUND_DIRECTION);
  }

  delete(key: string): Promise<void> {
    throw new Error("not implemented");
  }

  get(key: string): Promise<string | null> {
    throw new Error("not implemented");
  }

  set(key: string, value: string, ttlSeconds: number): Promise<void> {
    throw new Error("not implemneted");
  }
}
