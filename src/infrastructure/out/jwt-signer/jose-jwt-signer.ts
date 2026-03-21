import { JWT_SIGNER_PORT, OUTBOUND_DIRECTION } from "@/constants";
import { JwtSignerError } from "@/domain/errors/infrastructure-errors";
import type { JwtPayload, JwtSigner } from "@/domain/ports/out/jwt-signer";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import { jwtVerify, SignJWT } from "jose";

export type JoseJwtSignerConfig = {
  secret: string;
};

export class JoseJwtSigner extends BaseAdapter implements JwtSigner {
  private readonly secret: Buffer;

  constructor(config: JoseJwtSignerConfig) {
    super(JWT_SIGNER_PORT, OUTBOUND_DIRECTION, JwtSignerError);
    this.secret = Buffer.from(config.secret, "utf-8");
  }

  async sign(payload: Omit<JwtPayload, "iat">): Promise<string> {
    return this.call(
      () =>
        new SignJWT({ sub: payload.sub })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime(payload.exp)
          .sign(this.secret),
      "sign: JWT signing failed",
    );
  }

  async verify(token: string): Promise<JwtPayload> {
    const { payload } = await this.call(
      () => jwtVerify(token, this.secret),
      "verify: JWT verification failed",
    );

    if (!payload.sub || !payload.iat || !payload.exp) {
      throw new JwtSignerError("verify: invalid token payload");
    }

    return {
      sub: payload.sub,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
