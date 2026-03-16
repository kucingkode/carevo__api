import type { FastifyApp } from "../create-app";
import type { FastifyRestServerConfig } from "../config";
import type { FastifyRestServerDeps } from "../deps";

export function filesRoutes(
  config: FastifyRestServerConfig,
  deps: FastifyRestServerDeps,
) {
  return async (app: FastifyApp) => {
    // ===============================
    // uploadFile
    // ===============================

    app.post("/:fileId", async (req, reply) => {});

    // ===============================
    // getFile
    // ===============================

    app.get("/", async (req, reply) => {});
  };
}
