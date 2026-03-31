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
import { aiRoutes } from "./routes/ai-routes";
import { filesRoutes } from "./routes/files-routes";
import { postsRoutes } from "./routes/posts-routes";
import type { FastifyRestServerDeps } from "./deps";
import { usersRoutes } from "./routes/users-routes";
import { createVerifyAccessToken } from "./hooks/verify-access-token";
import type { FastifyError } from "fastify";

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
    // IP Address
    req.clientIp =
      (req.headers["cf-connecting-ip"] as string) ?? req.ip ?? null;

    // User Agent
    req.clientUa = req.headers["user-agent"] ?? null;
  });

  app.addHook("onSend", async (req, reply) => {
    reply.header("x-request-id", req.id);
  });

  // register application routes

  app.register(authRoutes(config, deps) as any, {
    prefix: "/api/v1/auth",
  });

  app.register(async (privateRouter) => {
    privateRouter.addHook("onRequest", createVerifyAccessToken(deps));

    privateRouter.register(aiRoutes(config, deps) as any, {
      prefix: "/api/v1/ai",
    });

    privateRouter.register(bootcampsRoutes(config, deps) as any, {
      prefix: "/api/v1/bootcamps",
    });

    privateRouter.register(certificationsRoutes(config, deps) as any, {
      prefix: "/api/v1/certifications",
    });

    privateRouter.register(communitiesRoutes(config, deps) as any, {
      prefix: "/api/v1/communities",
    });

    privateRouter.register(filesRoutes(config, deps) as any, {
      prefix: "/api/v1/files",
    });

    privateRouter.register(postsRoutes(config, deps) as any, {
      prefix: "/api/v1/posts",
    });

    privateRouter.register(usersRoutes(config, deps) as any, {
      prefix: "/api/v1/users",
    });
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

    if ((err as FastifyError).statusCode) {
      const { statusCode, message } = err as FastifyError;
      return reply.status(statusCode ?? 500).send({
        message,
      });
    }

    if (err instanceof DomainError && err.code) {
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
