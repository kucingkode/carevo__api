import type { FastifyApp } from "../create-app";
import type { FastifyRestServerConfig } from "../config";
import type { FastifyRestServerDeps } from "../deps";

export function proftosRoutes(
  config: FastifyRestServerConfig,
  deps: FastifyRestServerDeps,
) {
  return async (app: FastifyApp) => {
    // ===============================
    // listProftos
    // ===============================

    app.get("/", async (req, reply) => {});

    // ===============================
    // updateProfto
    // ===============================

    app.patch("/", async (req, reply) => {});

    // ===============================
    // getProfto
    // ===============================

    app.get("/u/:username", async (req, reply) => {});
  };
}
