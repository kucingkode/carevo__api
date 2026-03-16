import type { FastifyApp } from "../create-app";
import type { FastifyRestServerConfig } from "../config";
import type { FastifyRestServerDeps } from "../deps";

export function certificationsRoutes(
  config: FastifyRestServerConfig,
  deps: FastifyRestServerDeps,
) {
  return async (app: FastifyApp) => {
    // ===============================
    // listCertifications
    // ===============================

    app.get("/", async (req, reply) => {});

    // ===============================
    // getCertificationsFeed
    // ===============================

    app.get("/feed", async (req, reply) => {});
  };
}
