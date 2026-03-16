import type { FastifyApp } from "../create-app";
import type { FastifyRestServerConfig } from "../config";
import type { FastifyRestServerDeps } from "../deps";

export function cvsRoutes(
  config: FastifyRestServerConfig,
  deps: FastifyRestServerDeps,
) {
  return async (app: FastifyApp) => {
    // ===============================
    // getCv
    // ===============================

    app.get("/", async (req, reply) => {});

    // ===============================
    // updateCv
    // ===============================

    app.patch("/", async (req, reply) => {});

    // ===============================
    // downloadCv
    // ===============================

    app.get("/download", async (req, reply) => {});

    // ===============================
    // saveCv
    // ===============================

    app.post("/save", async (req, reply) => {});

    // ===============================
    // aiGenerateCv
    // ===============================

    app.post("/ai/generate", async (req, reply) => {});
  };
}
