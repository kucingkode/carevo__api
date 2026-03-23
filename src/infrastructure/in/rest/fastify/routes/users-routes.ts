import type { FastifyApp } from "../create-app";
import type { FastifyRestServerConfig } from "../config";
import type { FastifyRestServerDeps } from "../deps";
import { getBody, getParams, getQuery, qNumber } from "../utils";
import { listUsersInputSchema } from "@/domain/ports/in/users/list-users";
import { getUserCommunitiesInputSchema } from "@/domain/ports/in/users/get-user-communities";
import { getUserProftoInputSchema } from "@/domain/ports/in/users/get-user-profto";
import { updateUserProftoInputSchema } from "@/domain/ports/in/users/update-user-profto";
import { getCvInputSchema } from "@/domain/ports/in/cvs/get-cv";
import { updateCvInputSchema } from "@/domain/ports/in/cvs/update-cv";
import { renderCvInputSchema } from "@/domain/ports/in/cvs/render-cv";
import { Readable } from "node:stream";
import { getUserInputSchema } from "@/domain/ports/in/users/get-user";

export function usersRoutes(
  config: FastifyRestServerConfig,
  deps: FastifyRestServerDeps,
) {
  return async (app: FastifyApp) => {
    // ===============================
    // getUser
    // ===============================

    app.get("/me", async (req, reply) => {
      const getUserInput = getUserInputSchema.parse({
        requestUserId: req.userId,
      });

      const getUserOutput = await deps.getUserService.getUser(getUserInput);

      return reply.status(200).send(getUserOutput);
    });

    // ===============================
    // listUsers
    // ===============================

    app.get("/", async (req, reply) => {
      const q = getQuery(req);

      const listUsersInput = listUsersInputSchema.parse({
        query: q.query,
        page: qNumber(q.page),
        limit: qNumber(q.limit),
      });

      const listUsersOutput =
        await deps.listUsersService.listUsers(listUsersInput);

      return reply.status(200).send(listUsersOutput.users);
    });

    // ===============================
    // getUserCommunities
    // ===============================

    app.get("/:userId/communities", async (req, reply) => {
      const p = getParams(req);

      const getUserCommunitiesInput = getUserCommunitiesInputSchema.parse({
        userId: p.userId,
      });

      const getUserCommunitiesOutput =
        await deps.getUserCommunitiesService.getUserCommunities(
          getUserCommunitiesInput,
        );

      return reply.status(200).send(getUserCommunitiesOutput.communityIds);
    });

    // ===============================
    // getUserProfto
    // ===============================

    app.get("/u/:username/profto", async (req, reply) => {
      const p = getParams(req);

      const getUserProftoInput = getUserProftoInputSchema.parse({
        username: p.username,
      });

      const getUserProftoOutput =
        await deps.getUserProftoService.getUserProfto(getUserProftoInput);

      return reply.status(200).send(getUserProftoOutput.profto);
    });

    // ===============================
    // updateUserProfto
    // ===============================

    app.patch("/:userId/profto", async (req, reply) => {
      const p = getParams(req);

      const updateUserProftoInput = updateUserProftoInputSchema.parse({
        requestUserId: req.userId,
        userId: p.userId,
        profto: getBody(req),
      });

      await deps.updateUserProftoService.updateUserProfto(
        updateUserProftoInput,
      );

      return reply.status(200).send();
    });

    // ===============================
    // getCv
    // ===============================

    app.get("/:userId/cv", async (req, reply) => {
      const p = getParams(req);

      const getCvInput = getCvInputSchema.parse({
        requestUserId: p.userId,
        userId: p.userId,
      });

      const getCvOutput = await deps.getCvService.getCv(getCvInput);

      return reply.status(200).send(getCvOutput.cv);
    });

    // ===============================
    // updateCv
    // ===============================

    app.patch("/:userId/cv", async (req, reply) => {
      const p = getParams(req);

      const updateCvInput = updateCvInputSchema.parse({
        requestUserId: req.userId,
        userId: p.userId,
        partialCv: getBody(req),
      });

      await deps.updateCvService.updateCv(updateCvInput);

      return reply.status(200).send();
    });

    // ===============================
    // downloadCv
    // ===============================

    app.get("/:userId/cv/download", async (req, reply) => {
      const p = getParams(req);
      const q = getQuery(req);

      const renderCvInput = renderCvInputSchema.parse({
        requestUserId: req.userId,
        userId: p.userId,
        preview: q.preview,
      });

      const renderCvOutput = await deps.renderCvService.renderCv(renderCvInput);

      return reply
        .status(200)
        .type("application/pdf")
        .send(renderCvOutput.buffer);
    });

    // ===============================
    // saveCv
    // ===============================

    app.post("/:userId/cv/save", async (req, reply) => {
      const p = getParams(req);

      const renderCvInput = renderCvInputSchema.parse({
        requestUserId: req.userId,
        userId: p.userId,
        preview: false,
      });

      const renderCvOutput = await deps.renderCvService.renderCv(renderCvInput);

      const uploadFileOutput = await deps.uploadFileService.uploadFile({
        stream: Readable.from(renderCvOutput.buffer),
        mimeType: "application/pdf",
        requestUserId: renderCvInput.requestUserId,
      });

      await deps.updateUserProftoService.updateUserProfto({
        requestUserId: renderCvInput.requestUserId,
        userId: p.userId,
        profto: {
          cvFileId: uploadFileOutput.fileId,
        },
      });

      await deps.updateCvEmbeddingService.updateCvEmbedding({
        userId: renderCvInput.requestUserId,
      });

      return reply.status(200).send();
    });
  };
}
