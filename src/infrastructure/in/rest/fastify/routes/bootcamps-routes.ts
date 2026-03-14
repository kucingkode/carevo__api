import type { FastifyApp } from "../create-app";
import type { FastifyRestServerParams } from "../params";

export function bootcampsRoutes(params: FastifyRestServerParams) {
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
