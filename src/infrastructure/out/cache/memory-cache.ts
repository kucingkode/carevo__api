import { CACHE_PORT, OUTBOUND_DIRECTION } from "@/constants";
import { CacheError } from "@/domain/errors/infrastructure-errors";
import type { Cache } from "@/domain/ports/out/cache";
import { BaseAdapter } from "@/shared/classes/base-adapter";

export type MemoryCacheConfig = {
  maxSize: number;
};

export class MemoryCache extends BaseAdapter implements Cache {
  private readonly data: Map<string, string> = new Map();
  private readonly maxSize: number;

  constructor(config: MemoryCacheConfig) {
    super(CACHE_PORT, OUTBOUND_DIRECTION, CacheError);
    this.maxSize = config.maxSize;
  }

  async delete(key: string): Promise<void> {
    this.data.delete(key);
  }

  async get(key: string): Promise<string | null> {
    return this.data.get(key) ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    if (this.data.size >= this.maxSize) {
      this.log.debug("Max size reached, clearing cache...");
      this.clear();
    }

    this.data.set(key, value);
  }

  async clear(): Promise<void> {
    this.data.clear();
  }
}
