import type { Logger } from "@/observability/logging";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import underPressure from "@fastify/under-pressure";
import throttle from "@fastify/throttle";
import cookie from "@fastify/cookie";
import oauth2 from "@fastify/oauth2";
import multipart from "@fastify/multipart";
import { v7 as uuidV7 } from "uuid";

import type { FastifyRestServerConfig } from "./config";

export function createApp(log: Logger, config: FastifyRestServerConfig) {
  const app = Fastify({
    loggerInstance: log,
    genReqId: () => uuidV7(),
    trustProxy: true,
  });

  // Skip legacy content parsing
  app.addContentTypeParser(
    "application/x-www-form-urlencoded",
    (_request, _payload, done) => done(null, null),
  );

  app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      if (config.allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"), false);
      }
    },
    allowedHeaders: [
      "Content-Type",
      "traceparent",
      "x-request-id",
      "authorization",
    ],
    credentials: true,
  });

  app.register(helmet, {
    global: true,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: false,
  });

  if (config.rateLimitEnabled) {
    app.register(rateLimit, {
      max: config.rateLimitMax,
      timeWindow: config.rateLimitWindowMs,
      cache: 10000,
      keyGenerator: (req) => req.ip,
      errorResponseBuilder: (_req, context) => ({
        statusCode: 429,
        error: "RATE_LIMITED",
        message: `Too many attempts, try again in ${context.after}`,
      }),
    });
  }

  app.register(underPressure, {
    maxEventLoopDelay: config.maxEventLoopDelay,
    maxHeapUsedBytes: config.maxHeapBytes,
    maxRssBytes: config.maxRssBytes,
    maxEventLoopUtilization: config.maxElu,
    retryAfter: 50, // Retry-After header value in ms
    exposeStatusRoute: "/health",
    healthCheck: async () => {
      try {
        await config.pingDatabase();
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

  app.register(cookie, {
    secret: config.signedCookieSecret,
  });

  app.register(multipart);

  app.register(oauth2, {
    name: "GoogleOAuth2",
    scope: ["profile", "email"],
    credentials: {
      client: {
        id: config.googleOauthClientId,
        secret: config.googleOauthSecret,
      },
    },
    startRedirectPath: "/api/v1/auth/oauth/google",
    callbackUri: `${config.apiBaseUrl}/api/v1/auth/oauth/google/callback`,
    discovery: {
      issuer: "https://accounts.google.com",
    },
  });

  return app;
}

export type FastifyApp = ReturnType<typeof createApp>;
