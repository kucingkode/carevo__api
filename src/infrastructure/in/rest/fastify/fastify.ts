import { INBOUND_DIRECTION, REST_SERVER_PORT } from "@/constants";
import type { FastifyRestServerConfig } from "./config";
import { createApp } from "./create-app";
import { ZodError } from "zod";
import { DomainError } from "@/domain/errors/domain/domain-error";
import { authRoutes } from "./routes/auth-routes";
import { ERROR_HTTP_STATUS_CODES } from "./error-http-status-codes";
import { createAdapterLogger } from "@/shared/utils/create-adapter-logger";
import { bootcampsRoutes } from "./routes/bootcamps-routes";
import { certificationsRoutes } from "./routes/certifications-routes";
import { communitiesRoutes } from "./routes/communities-routes";
import { cvsRoutes } from "./routes/cvs-routes";
import { filesRoutes } from "./routes/files-routes";
import { postsRoutes } from "./routes/posts-routes";
import { proftosRoutes } from "./routes/proftos-routes";
import type { FastifyRestServerDeps } from "./deps";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";

export async function createFastifyRestServer(
  config: FastifyRestServerConfig,
  deps: FastifyRestServerDeps,
) {
  const log = createAdapterLogger(
    "Fastify",
    REST_SERVER_PORT,
    INBOUND_DIRECTION,
  );

  const app = createApp(log, config);

  // add hooks

  app.addHook("onRequest", async (req) => {
    req.clientIp =
      (req.headers["cf-connecting-ip"] as string) ?? req.ip ?? null;

    req.clientUa = req.headers["user-agent"] ?? null;

    if (req.headers["authorization"]) {
      try {
        console.log(
          "iowwi",
          req.headers["authorization"].replace("Bearer ", "")[0],
        );
        const accessTokenPayload = await deps.tokenProvider.verifyAccessToken(
          req.headers["authorization"].replace("Bearer ", ""),
        );

        req.userId = accessTokenPayload.userId;
      } catch (err) {
        log.debug(
          { err, ipAddress: req.clientIp },
          "Access token verification failed",
        );
        throw new UnauthorizedError("Invalid access token");
      }
    }
  });

  app.addHook("onSend", async (req, reply) => {
    reply.header("x-request-id", req.id);
  });

  // register application routes

  app.register(authRoutes(config, deps) as any, {
    prefix: "/api/v1/auth",
  });

  app.register(bootcampsRoutes(config, deps) as any, {
    prefix: "/api/v1/bootcamps",
  });

  app.register(certificationsRoutes(config, deps) as any, {
    prefix: "/api/v1/certifications",
  });

  app.register(communitiesRoutes(config, deps) as any, {
    prefix: "/api/v1/communities",
  });

  app.register(cvsRoutes(config, deps) as any, {
    prefix: "/api/v1/cvs",
  });

  app.register(filesRoutes(config, deps) as any, {
    prefix: "/api/v1/files",
  });

  app.register(postsRoutes(config, deps) as any, {
    prefix: "/api/v1/posts",
  });

  app.register(proftosRoutes(config, deps) as any, {
    prefix: "/api/v1/proftos",
  });

  // error handler

  app.setErrorHandler((err, _req, reply) => {
    if (err instanceof ZodError) {
      return reply.status(400).send({
        error: "VALIDATION_ERROR",
        message: "Request validation failed",
        fields: err.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    if (err instanceof DomainError) {
      const statusCode = ERROR_HTTP_STATUS_CODES[err.code] ?? 500;

      return reply.status(statusCode).send({
        error: err.code,
        message: err.message,
      });
    }

    log.error({ err });

    return reply.status(500).send({
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    });
  });

  await app.listen({
    host: config.host,
    port: config.port,
  });

  return app;
}
