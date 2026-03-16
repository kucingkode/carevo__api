import type { FastifyApp } from "../create-app";
import type { FastifyRestServerConfig } from "../config";
import type { FastifyRestServerDeps } from "../deps";

export function communitiesRoutes(
  config: FastifyRestServerConfig,
  deps: FastifyRestServerDeps,
) {
  return async (app: FastifyApp) => {
    // ===============================
    // listCommunities
    // ===============================

    app.get("/", async (req, reply) => {});

    // ===============================
    // joinCommunity
    // ===============================

    app.post("/join", async (req, reply) => {});

    // ===============================
    // leaveCommunity
    // ===============================

    app.get("/leave", async (req, reply) => {});

    // ===============================
    // getCommunitiesFeed
    // ===============================

    app.get("/feed", async (req, reply) => {});
  };
}
