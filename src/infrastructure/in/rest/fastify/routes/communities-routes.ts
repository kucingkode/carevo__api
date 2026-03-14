import type { FastifyApp } from "../create-app";
import type { FastifyRestServerParams } from "../params";

export function communitiesRoutes(params: FastifyRestServerParams) {
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
