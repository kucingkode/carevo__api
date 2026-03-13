import { DrizzleDatabase } from "@/infrastructure/out/database/drizzle/database";
import { getLogger, initLogger } from "@/observability/logging";
import { loadConfig } from "./config";
import { DrizzleUsersRepository } from "@/infrastructure/out/database/drizzle/repository/users-repository";
import { Argon2idHasher } from "@/infrastructure/out/hasher/argon-hasher";
import { NodemailerEmailSender } from "@/infrastructure/out/email-sender/nodemailer-email-sender";
import { RegisterUserService } from "./services/auth/register-user";
import { createFastifyRestServer } from "@/infrastructure/in/rest/fastify/fastify";
import { randomBytes } from "node:crypto";
import { SERVICE_NAME, SERVICE_VERSION } from "@/constants";

export async function bootstrap() {
  // ===============================
  // Config
  // ===============================
  const appConfig = loadConfig();

  // ===============================
  // Handlers
  // ===============================
  // reload handlers
  process.on("SIGHUP", () => {
    log.info("Hang up signal detected, reloading...");
    reload();
  });

  // termination handlers
  process.on("uncaughtException", (err) => {
    log.fatal({ err }, "Uncaught exception detected, attempting shutdown...");
    shutdown(1);
  });

  process.on("SIGTERM", () => {
    log.fatal("Termination signal detected, attempting shutdown...");
    shutdown(0);
  });

  process.on("SIGINT", () => {
    log.fatal("Interrupt signal detected, attempting shutdown...");
    shutdown(0);
  });

  // ===============================
  // Logger
  // ===============================
  initLogger(
    {
      logLevel: appConfig.LOG_LEVEL,
      nodeEnv: appConfig.NODE_ENV,
    },
    {
      service: SERVICE_NAME,
      version: SERVICE_VERSION,
    },
  );

  const log = getLogger();

  // ===============================
  // Database
  // ===============================
  const db = new DrizzleDatabase({
    host: appConfig.DB_HOST,
    port: appConfig.DB_PORT,
    password: appConfig.DB_PASSWORD,
    user: appConfig.DB_USER,
    database: appConfig.DB_DATABASE,
    ssl: appConfig.DB_SSL,
  });
  await db.ping();
  log.info("Database connected");

  const usersRepository = new DrizzleUsersRepository();

  // ===============================
  // Email Sender
  // ===============================
  const emailSender = new NodemailerEmailSender({
    host: appConfig.SMTP_HOST,
    port: appConfig.SMTP_PORT,
    secure: appConfig.SMTP_SECURE,
    auth: {
      email: appConfig.SMTP_AUTH_EMAIL,
      password: appConfig.SMTP_AUTH_PASSWORD,
    },
  });

  // ===============================
  // Hasher
  // ===============================
  const hasher = new Argon2idHasher({
    secret: appConfig.HASH_SECRET
      ? Buffer.from(appConfig.HASH_SECRET, "utf-8")
      : Buffer.alloc(0),
    salt: appConfig.HASH_SALT
      ? Buffer.from(appConfig.HASH_SALT, "utf-8")
      : randomBytes(16),
    hashLength: appConfig.HASH_LENGTH,
    memoryCost: appConfig.HASH_MEMORY_COST,
    timeCost: appConfig.HASH_TIME_COST,
    parallelism: appConfig.HASH_PARALLELISM,
  });

  // ===============================
  // Application
  // ===============================
  const registerUserService = new RegisterUserService({
    db,
    usersRepository,
    hasher,
    emailSender,
  });

  // ===============================
  // Inbounds
  // ===============================
  const app = createFastifyRestServer({
    host: appConfig.HOST,
    port: appConfig.PORT,
    allowedOrigins: appConfig.ALLOWED_ORIGINS.split(","),

    // services
    registerUserService,
  });

  return app;
}

async function shutdown(code: 0 | 1) {
  const logger = getLogger();

  try {
  } catch (err) {
    logger.error({ err }, "Error terminating tracing");
  }

  setTimeout(() => {
    logger.error(
      "graceful shutdown is not achieved after 5 second, aborting...",
    );
    process.abort();
  }, 5000).unref();

  process.exit(code);
}

async function reload() {}
