import { HASHER_PORT, OUTBOUND_DIRECTION } from "@/constants";
import { HasherError } from "@/domain/errors/infrastructure-errors";
import type { Hasher } from "@/domain/ports/out/hasher";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import { hash, verify } from "argon2";

export type ArgonHasherParams = {
  secret: Buffer<ArrayBufferLike>;
  salt: Buffer<ArrayBufferLike>;
  timeCost: number;
  hashLength: number;
  memoryCost: number;
  parallelism: number;
};

export class ArgonHasher extends BaseAdapter implements Hasher {
  private readonly secret: Buffer<ArrayBufferLike>;
  private readonly hashConfig: {
    secret: Buffer<ArrayBufferLike>;
    salt: Buffer<ArrayBufferLike>;
    timeCost: number;
    hashLength: number;
    memoryCost: number;
    parallelism: number;
  };

  constructor(params: ArgonHasherParams) {
    super(HASHER_PORT, OUTBOUND_DIRECTION, HasherError);

    this.hashConfig = {
      secret: params.secret,
      salt: params.salt,
      hashLength: params.hashLength,
      timeCost: params.timeCost,
      memoryCost: params.memoryCost,
      parallelism: params.parallelism,
    };

    this.secret = params.secret;
  }

  hash(plain: string) {
    return this.call(
      () => hash(plain, this.hashConfig),
      "hash: argon2 hash failed",
    );
  }

  compare(plain: string, hashed: string): Promise<boolean> {
    return this.call(
      () =>
        verify(hashed, plain, {
          secret: this.secret,
        }),
      "compare: argon2 verify failed",
    );
  }
}
