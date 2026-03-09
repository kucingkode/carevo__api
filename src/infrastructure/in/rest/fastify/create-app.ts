import type { Logger } from "@/observability/logging";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";

import type { FastifyRestServerParams } from "./params";

export function createApp(log: Logger, params: FastifyRestServerParams) {
  const app = Fastify({
    loggerInstance: log,
  });

  app.register(rateLimit);
  app.register(helmet, { global: true });

  app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      if (params.allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"), false);
      }
    },
    allowedHeaders: ["Content-Type", "traceparent", "x-request-id"],
    credentials: true,
  });

  return app;
}

export type FastifyApp = ReturnType<typeof createApp>;
