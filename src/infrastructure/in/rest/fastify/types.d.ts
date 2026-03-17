import type { OAuth2Namespace } from "@fastify/oauth2";
import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    GoogleOAuth2: OAuth2Namespace;
  }

  interface FastifyRequest {
    clientIp: string | null;
    clientUa: string | null;
    userId: string | null;
  }
}
