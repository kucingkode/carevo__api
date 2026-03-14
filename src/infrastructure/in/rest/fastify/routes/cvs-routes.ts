import type { FastifyApp } from "../create-app";
import type { FastifyRestServerParams } from "../params";

export function cvsRoutes(params: FastifyRestServerParams) {
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
