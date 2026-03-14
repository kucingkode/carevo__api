import type { Logger } from "@/observability/logging";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import underPressure from "@fastify/under-pressure";
import throttle from "@fastify/throttle";
import { v7 as uuidV7 } from "uuid";

import type { FastifyRestServerParams } from "./params";

export function createApp(log: Logger, params: FastifyRestServerParams) {
  const { config } = params;

  const app = Fastify({
    loggerInstance: log,
    genReqId: () => uuidV7(),
  });

  app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      if (params.config.allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"), false);
      }
    },
    allowedHeaders: ["Content-Type", "traceparent", "x-request-id"],
    credentials: true,
  });

  app.register(helmet, {
    global: true,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: false,
  });

  app.register(rateLimit, {
    max: config.rateLimitMax,
    timeWindow: config.rateLimitWindowMs,
    cache: 10000,
    keyGenerator: (req) => req.ip,
    errorResponseBuilder: (req, context) => ({
      statusCode: 429,
      error: "RATE_LIMITED",
      message: `Too many attempts, try again in ${context.after}`,
    }),
  });

  app.register(underPressure, {
    maxEventLoopDelay: config.maxEventLoopDelay,
    maxHeapUsedBytes: config.maxHeapBytes, // 900MB
    maxRssBytes: config.maxRssBytes, // 1GB
    maxEventLoopUtilization: config.maxElu, // 98% ELU
    retryAfter: 50, // Retry-After header value in ms
    exposeStatusRoute: "/health",
    healthCheck: async () => {
      try {
        await params.pingDatabase();
      } catch (err) {
        log.error({ err }, "Health check failed");
        return false;
      }

      return true;
    },
    healthCheckInterval: 5000,
    message: "Service temporarily unavailable",
  });

  app.register(throttle, {
    bytesPerSecond: 1024 * 512, // 512KB/s default for all routes
  });

  return app;
}

export type FastifyApp = ReturnType<typeof createApp>;
