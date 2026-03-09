import { INBOUND_DIRECTION, REST_SERVER_PORT } from "@/constants";
import { getLogger } from "@/observability/logging";
import type { FastifyRestServerParams } from "./params";
import { createApp } from "./create-app";
import { ZodError } from "zod";
import { DomainError } from "@/domain/errors/domain/domain-error";
import { RatelimitedError } from "@/domain/errors/rate-limited-error";
import { authRoutes } from "./routes/auth-routes";

export async function createFastifyRestServer(params: FastifyRestServerParams) {
  const log = getLogger().child({
    component: "Fastify",
    port: REST_SERVER_PORT,
    direction: INBOUND_DIRECTION,
  });

  const app = createApp(log, params);

  app.get("/health", async () => {
    return { ok: true };
  });

  app.register(authRoutes(params) as any, {
    prefix: "/api/v1/auth",
  });

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
      return reply.status(409).send({
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
    host: params.host,
    port: params.port,
  });
}
