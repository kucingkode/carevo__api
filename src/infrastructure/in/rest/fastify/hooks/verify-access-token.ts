import type { AccessTokenPayload } from "@/domain/ports/out/token-provider";
import type { FastifyRequest } from "fastify";
import type { FastifyRestServerDeps } from "../deps";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";

export function createVerifyAccessToken(deps: FastifyRestServerDeps) {
  return async (req: FastifyRequest) => {
    req.userId = null;

    if (!req.headers["authorization"]) throw new UnauthorizedError();

    // get payload
    let accessTokenPayload: AccessTokenPayload | void;
    try {
      accessTokenPayload = await deps.tokenProvider.verifyAccessToken(
        req.headers["authorization"].replace("Bearer ", ""),
      );
    } catch (err) {
      throw new UnauthorizedError();
    }

    if (!accessTokenPayload) throw new UnauthorizedError();

    // get user id
    req.userId = accessTokenPayload.userId;
  };
}
