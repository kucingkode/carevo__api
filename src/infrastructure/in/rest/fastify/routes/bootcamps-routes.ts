import { listBootcampsInputSchema } from "@/domain/ports/in/bootcamps/list-bootcamps";
import type { FastifyRestServerConfig } from "../config";
import type { FastifyApp } from "../create-app";
import type { FastifyRestServerDeps } from "../deps";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import { getBootcampsFeedInputSchema } from "@/domain/ports/in/bootcamps/get-bootcamps-feed";
import { getQuery, qNumber } from "../utils";

export function bootcampsRoutes(
  config: FastifyRestServerConfig,
  deps: FastifyRestServerDeps,
) {
  return async (app: FastifyApp) => {
    // ===============================
    // listBootcamps
    // ===============================

    app.get("/", async (req, reply) => {
      const q = getQuery(req);

      const listBootcampsInput = listBootcampsInputSchema.parse({
        requestUserId: req.userId,
        query: q.query,
        professionRole: q.professionRole,
        page: qNumber(q.page),
        limit: qNumber(q.limit),
      });

      const listBootcampsOutput =
        await deps.listBootcampsService.listBootcamps(listBootcampsInput);

      return reply.status(200).send(listBootcampsOutput.bootcamps);
    });

    // ===============================
    // getBootcampsFeed
    // ===============================

    app.get("/feed", async (req, reply) => {
      const q = getQuery(req);

      const getBootcampsFeedInput = getBootcampsFeedInputSchema.parse({
        requestUserId: req.userId,
        page: qNumber(q.page),
        limit: qNumber(q.limit),
      });

      const getBootcampsFeedOutput =
        await deps.getBootcampsFeedService.getBootcampsFeed(
          getBootcampsFeedInput,
        );

      return reply.status(200).send(getBootcampsFeedOutput.bootcamps);
    });
  };
}
