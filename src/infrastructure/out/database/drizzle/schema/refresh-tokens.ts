import { sql } from "drizzle-orm";
import {
  check,
  inet,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid().primaryKey(),
    userId: uuid()
      .primaryKey()
      .references(() => users.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    tokenHash: text().notNull(),
    ipAddress: inet(),
    userAgent: text(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    revokedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull(),
  },
  (t) => [check("user_agent_length", sql`char_length(${t.userAgent}) <= 512`)],
);
