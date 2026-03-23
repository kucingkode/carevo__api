import type { FastifyApp } from "../create-app";
import type { FastifyRestServerConfig } from "../config";
import type { FastifyRestServerDeps } from "../deps";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import { joinCommunityInputSchema } from "@/domain/ports/in/communities/join-community";
import { leaveCommunityInputSchema } from "@/domain/ports/in/communities/leave-community";
import { getParams, getQuery, qNumber } from "../utils";
import { listBootcampsInputSchema } from "@/domain/ports/in/bootcamps/list-bootcamps";

export function communitiesRoutes(
  config: FastifyRestServerConfig,
  deps: FastifyRestServerDeps,
) {
  return async (app: FastifyApp) => {
    // ===============================
    // listCommunities
    // ===============================

    app.get("/", async (req, reply) => {
      const q = getQuery(req);

      const listCommunitiesInput = listBootcampsInputSchema.parse({
        query: q.query,
        professionRole: q.professionRole,
        page: qNumber(q.page),
        limit: qNumber(q.limit),
      });

      const listCommunitiesOutput =
        await deps.listCommunitiesService.listCommunities(listCommunitiesInput);

      return reply.status(200).send(listCommunitiesOutput.communities);
    });

    // ===============================
    // joinCommunity
    // ===============================

    app.post("/:communityId/join", async (req, reply) => {
      const p = getParams(req);

      const joinCommunityInput = joinCommunityInputSchema.parse({
        communityId: p.communityId,
        requestUserId: req.userId,
      });

      await deps.joinCommunityService.joinCommunity(joinCommunityInput);

      return reply.status(200);
    });

    // ===============================
    // leaveCommunity
    // ===============================

    app.post("/:communityId/leave", async (req, reply) => {
      if (!req.userId) throw new UnauthorizedError();

      const p = getParams(req);

      const leaveCommunityInput = leaveCommunityInputSchema.parse({
        communityId: p.communityId,
        requestUserId: req.userId,
      });

      await deps.leaveCommunityService.leaveCommunity(leaveCommunityInput);

      return reply.status(200);
    });
  };
}
