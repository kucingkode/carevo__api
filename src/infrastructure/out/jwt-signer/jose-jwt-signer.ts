import { JwtSignerError } from "@/domain/errors/infrastructure/jwt-signer-error";
import type { JwtPayload, JwtSigner } from "@/domain/ports/out/jwt-signer";
import { jwtVerify, SignJWT } from "jose";

export type JoseJwtSignerConfig = {
  secret: string;
};

export class JoseJwtSigner implements JwtSigner {
  private readonly secret: Buffer;

  constructor(config: JoseJwtSignerConfig) {
    this.secret = Buffer.from(config.secret, "utf-8");
  }

  async sign(payload: Omit<JwtPayload, "iat">): Promise<string> {
    return new SignJWT({ sub: payload.sub })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(payload.exp)
      .sign(this.secret);
  }

  async verify(token: string): Promise<JwtPayload> {
    const { payload } = await jwtVerify(token, this.secret);

    if (!payload.sub || !payload.iat || !payload.exp) {
      throw new JwtSignerError("Invalid token payload");
    }

    return {
      sub: payload.sub,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
