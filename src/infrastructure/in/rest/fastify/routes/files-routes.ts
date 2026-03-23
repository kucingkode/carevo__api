import type { FastifyApp } from "../create-app";
import type { FastifyRestServerConfig } from "../config";
import type { FastifyRestServerDeps } from "../deps";
import fs from "node:fs";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import { getFileInputSchema } from "@/domain/ports/in/files/get-file";
import { DomainError } from "@/domain/errors/domain/domain-error";
import { uploadFileInputSchema } from "@/domain/ports/in/files/upload-file";
import { getParams } from "../utils";

export function filesRoutes(
  config: FastifyRestServerConfig,
  deps: FastifyRestServerDeps,
) {
  return async (app: FastifyApp) => {
    // ===============================
    // getFile
    // ===============================

    app.get("/:fileId", async (req, reply) => {
      const p = getParams(req);

      const getFileInput = getFileInputSchema.parse({
        requestUserId: req.userId,
        fileId: p.fileId,
      });

      const getFileOutput = await deps.getFileService.getFile(getFileInput);

      return reply
        .header("content-disposition", `attachment; filename=""`)
        .type(getFileOutput.mimeType)
        .send(getFileOutput.stream);
    });

    // ===============================
    // uploadFile
    // ===============================

    app.post(
      "/upload",
      {
        config: {
          multipartOptions: {
            limits: {
              fieldSize: 10 * 1024 * 1024,
            },
          },
        },
      },
      async (req, reply) => {
        const data = await req.file();
        if (!data) {
          throw new DomainError("Missing file", "VALIDATION_ERROR");
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(data.mimetype)) {
          throw new DomainError("Invalid file type", "VALIDATION_ERROR");
        }

        const uploadFileInput = uploadFileInputSchema.parse({
          requestUserId: req.userId,
          mimeType: data.mimetype,
          stream: data.file,
        });

        const uploadFileOutput =
          await deps.uploadFileService.uploadFile(uploadFileInput);

        return reply.status(201).send({
          fileId: uploadFileOutput.fileId,
        });
      },
    );
  };
}
