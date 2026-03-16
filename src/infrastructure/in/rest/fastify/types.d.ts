import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    clientIp: string | null;
    clientUa: string | null;
    userId: string | null;
  }
}
