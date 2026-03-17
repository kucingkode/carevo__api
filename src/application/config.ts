import { z } from "zod";

const appConfigSchema = z.object({
  NODE_ENV: z.enum(["production", "development"]).default("development"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

  HASH_PEPPER: z.string(),
  HASH_SALT: z.string().optional(),
  HASH_LENGTH: z.coerce.number().int().default(32),
  HASH_TIME_COST: z.coerce.number().int().default(3),
  HASH_MEMORY_COST: z.coerce.number().int().default(65536),
  HASH_PARALLELISM: z.coerce.number().int().default(4),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().int(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_SSL: z.enum([
    "disable",
    "allow",
    "prefer",
    "require",
    "verify-ca",
    "verify-full",
  ]),

  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().default(3000),
  ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),

  RATE_LIMIT_MAX: z.coerce.number().int().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().default(60_000),

  MAX_EVENT_LOOP_DELAY: z.coerce.number().int().default(1000),
  MAX_HEAP_USED_BYTES: z.coerce
    .number()
    .int()
    .default(900 * 1024 * 1024), // 900MB
  MAX_RSS_BYTES: z.coerce
    .number()
    .int()
    .default(1024 * 1024 * 1024), // 1GB
  MAX_ELU: z.coerce.number().default(0.98),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number().int(),
  SMTP_SECURE: z.enum(["true", "false"]).transform((v) => v === "true"),
  SMTP_AUTH_EMAIL: z.string(),
  SMTP_AUTH_PASSWORD: z.string(),

  UI_BASE_URL: z.url(),
  API_BASE_URL: z.url(),

  OPENAI_API_KEY: z.string(),

  JWT_SECRET: z.string(),

  ACCESS_TOKEN_TTL: z.coerce
    .number()
    .int()
    .default(15 * 60_000),
  REFRESH_TOKEN_TTL: z.coerce
    .number()
    .int()
    .default(7 * 24 * 60 * 60_000),
  REFRESH_TOKEN_TTL_EXTENDED: z.coerce
    .number()
    .int()
    .default(30 * 24 * 60 * 60_000),

  COOKIE_SAME_SITE: z.enum(["none", "lax", "strict"]).default("lax"),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECURE: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .default(true),
  SIGNED_COOKIE_SECRET: z.string(),

  GOOGLE_OAUTH_CLIENT_ID: z.string(),
  GOOGLE_OAUTH_SECRET: z.string(),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export function loadConfig() {
  return appConfigSchema.parse(process.env);
}
