import type { FastifyRequest } from "fastify";
import z from "zod";

export const qNumber = (v: unknown) => z.coerce.number().optional().parse(v);
export const qBoolean = (v: unknown) => {
  return z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional()
    .parse(v);
};

export const getQuery = (req: FastifyRequest) =>
  req.query as Record<string, string>;

export const getParams = (req: FastifyRequest) =>
  req.params as Record<string, string>;

export const getBody = (req: FastifyRequest) =>
  req.body as Record<string, unknown>;
