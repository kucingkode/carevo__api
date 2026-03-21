import type { FastifyApp } from "../create-app";
import type { FastifyRestServerConfig } from "../config";
import type { FastifyRestServerDeps } from "../deps";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import { getCertificationsFeedInputSchema } from "@/domain/ports/in/certifications/get-certifications-feed";
import { getQuery, qNumber } from "../utils";
import { listCertificationsInputSchema } from "@/domain/ports/in/certifications/list-certifications";

export function certificationsRoutes(
  config: FastifyRestServerConfig,
  deps: FastifyRestServerDeps,
) {
  return async (app: FastifyApp) => {
    // ===============================
    // listCertifications
    // ===============================

    app.get("/", async (req, reply) => {
      if (!req.userId) throw new UnauthorizedError();

      const q = getQuery(req);

      const listCertificationsInput = listCertificationsInputSchema.parse({
        query: q.query,
        professionRole: q.professionRole,
        page: qNumber(q.page),
        limit: qNumber(q.limit),
      });

      const listCertificationsOutput =
        await deps.listCertificationsService.listCertifications(
          listCertificationsInput,
        );

      return reply.status(200).send(listCertificationsOutput.certifications);
    });

    // ===============================
    // getCertificationsFeed
    // ===============================

    app.get("/feed", async (req, reply) => {
      if (!req.userId) throw new UnauthorizedError();

      const q = getQuery(req);

      const getCertificationsFeedInput = getCertificationsFeedInputSchema.parse(
        {
          requestUserId: req.userId,
          page: qNumber(q.page),
          limit: qNumber(q.limit),
        },
      );

      const getCertificationsFeedOutput =
        await deps.getCertificationsFeedService.getCertificationsFeed(
          getCertificationsFeedInput,
        );

      return reply.status(200).send(getCertificationsFeedOutput.certifications);
    });
  };
}
