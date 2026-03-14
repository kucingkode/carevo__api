import type { Hasher } from "@/domain/ports/out/hasher";
import { hash, verify } from "argon2";

export type ArgonHasherParams = {
  secret: Buffer<ArrayBufferLike>;
  salt: Buffer<ArrayBufferLike>;
  timeCost: number;
  hashLength: number;
  memoryCost: number;
  parallelism: number;
};

export class ArgonHasher implements Hasher {
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
    return hash(plain, this.hashConfig);
  }

  compare(plain: string, hashed: string): Promise<boolean> {
    return verify(hashed, plain, {
      secret: this.secret,
    });
  }
}
