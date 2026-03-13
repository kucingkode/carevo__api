import { DrizzleDatabase } from "./infrastructure/out/database/drizzle/database";
import { initLogger } from "./observability/logging";

initLogger({
  logLevel: (process.env.LOG_LEVEL || "info") as any,
  nodeEnv: (process.env.NODE_ENV || "development") as any,
});

const db = new DrizzleDatabase({
  host: process.env.DB_HOST!,
  database: process.env.DB_DATABASE!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  port: +process.env.DB_PORT!,
  ssl: process.env.DB_SSL! as any,
});

await db.migrate();
