import { z } from "zod";

const appConfigSchema = z.object({
  NODE_ENV: z.enum(["production", "development"]).default("development"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

  HASH_SECRET: z.string().optional(),
  HASH_SALT: z.string().optional(),
  HASH_LENGTH: z.coerce.number().int().default(32),
  HASH_TIME_COST: z.coerce.number().int().default(3),
  HASH_MEMORY_COST: z.coerce
    .number()
    .int()
    .default(1 << 16),
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
  ALLOWED_ORIGINS: z.string().default("localhost"),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number().int(),
  SMTP_SECURE: z.enum(["true", "false"]).transform((v) => v === "true"),
  SMTP_AUTH_EMAIL: z.string(),
  SMTP_AUTH_PASSWORD: z.string(),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export function loadConfig() {
  return appConfigSchema.parse(process.env);
}
