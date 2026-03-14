import type { FastifyApp } from "../create-app";
import type { FastifyRestServerParams } from "../params";

export function filesRoutes(params: FastifyRestServerParams) {
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
