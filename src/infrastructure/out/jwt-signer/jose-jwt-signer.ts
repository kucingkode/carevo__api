import type { JwtPayload, JwtSigner } from "@/domain/ports/out/jwt-signer";

export type JoseJwtSignerParams = {};

export class JoseJwtSigner implements JwtSigner {
  constructor(params: JoseJwtSignerParams) {}

  sign(payload: Omit<JwtPayload, "iat">): string {
    throw new Error("not implemented");
  }

  verify(token: string): JwtPayload {
    throw new Error("not implemented");
  }
}
