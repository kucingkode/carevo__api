import { INBOUND_DIRECTION, REST_SERVER_PORT } from "@/constants";
import type { FastifyRestServerParams } from "./params";
import { createApp } from "./create-app";
import { ZodError } from "zod";
import { DomainError } from "@/domain/errors/domain/domain-error";
import { RatelimitedError } from "@/domain/errors/rate-limited-error";
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

export async function createFastifyRestServer(params: FastifyRestServerParams) {
  const log = createAdapterLogger(
    "Fastify",
    REST_SERVER_PORT,
    INBOUND_DIRECTION,
  );

  const config = params.config;

  const app = createApp(log, params);

  // register application routes

  app.register(authRoutes(params) as any, {
    prefix: "/api/v1/auth",
  });

  app.register(bootcampsRoutes(params) as any, {
    prefix: "/api/v1/bootcamps",
  });

  app.register(certificationsRoutes(params) as any, {
    prefix: "/api/v1/certifications",
  });

  app.register(communitiesRoutes(params) as any, {
    prefix: "/api/v1/communities",
  });

  app.register(cvsRoutes(params) as any, {
    prefix: "/api/v1/cvs",
  });

  app.register(filesRoutes(params) as any, {
    prefix: "/api/v1/files",
  });

  app.register(postsRoutes(params) as any, {
    prefix: "/api/v1/posts",
  });

  app.register(proftosRoutes(params) as any, {
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

    if (err instanceof RatelimitedError) {
      return reply.status(429).send({
        error: "RATE_LIMITED",
        message: "Too many attempts, please try again later",
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
