import type { FastifyApp } from "../create-app";
import type { FastifyRestServerParams } from "../params";

export function certificationsRoutes(params: FastifyRestServerParams) {
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
