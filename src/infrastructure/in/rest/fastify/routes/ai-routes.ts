import type { FastifyApp } from "../create-app";
import type { FastifyRestServerConfig } from "../config";
import type { FastifyRestServerDeps } from "../deps";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import { aiGenerateCvInputSchema } from "@/domain/ports/in/cvs/ai-generate-cv";
import { getBody } from "../utils";
import { Readable } from "node:stream";

export function aiRoutes(
  config: FastifyRestServerConfig,
  deps: FastifyRestServerDeps,
) {
  return async (app: FastifyApp) => {
    // ===============================
    // aiGenerateCv
    // ===============================

    app.post("/generate-cv", async (req, reply) => {
      if (!req.userId) throw new UnauthorizedError();

      const aiGenerateCvInput = aiGenerateCvInputSchema.parse({
        ...getBody(req),
        requestUserId: req.userId,
      });

      const aiGenerateCvOutput =
        deps.aiGenerateCvService.aiGenerateCv(aiGenerateCvInput);

      const stream = Readable.from(aiGenerateCvOutput);
      reply.send(stream);
    });
  };
}
