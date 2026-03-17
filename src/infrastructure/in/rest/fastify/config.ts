export type FastifyRestServerConfig = {
  host: string;
  port: number;

  // cors
  allowedOrigins: string[];

  // rate limit
  rateLimitMax: number;
  rateLimitWindowMs: number;

  // under presssure
  maxEventLoopDelay: number;
  maxHeapBytes: number;
  maxRssBytes: number;
  maxElu: number;

  // cookie
  cookieOptions?: {
    sameSite?: "lax" | "strict" | "none";
    domain?: string;
    secure?: boolean;
  };
  signedCookieSecret: string;

  // base urls
  uiBaseUrl: string;
  apiBaseUrl: string;

  // health check
  pingDatabase(): Promise<void>;

  // oauth
  googleOauthClientId: string;
  googleOauthSecret: string;
};
