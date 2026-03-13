import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const emailTokens = pgTable("email_tokens", {
  userId: uuid()
    .primaryKey()
    .references(() => users.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  tokenHash: text().notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  usedAt: timestamp({ withTimezone: true }),
  createdAt: timestamp({ withTimezone: true }).notNull(),
});
