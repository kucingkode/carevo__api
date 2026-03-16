import type { FastifyRestServerConfig } from "../config";
import type { FastifyApp } from "../create-app";
import type { FastifyRestServerDeps } from "../deps";

export function bootcampsRoutes(
  config: FastifyRestServerConfig,
  deps: FastifyRestServerDeps,
) {
  return async (app: FastifyApp) => {
    // ===============================
    // listBootcamps
    // ===============================

    app.get("/", async (req, reply) => {});

    // ===============================
    // getBootcampsFeed
    // ===============================

    app.get("/feed", async (req, reply) => {});
  };
}
