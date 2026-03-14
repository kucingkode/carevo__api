import type { FastifyApp } from "../create-app";
import type { FastifyRestServerParams } from "../params";

export function proftosRoutes(params: FastifyRestServerParams) {
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
