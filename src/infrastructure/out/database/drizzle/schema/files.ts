import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const files = pgTable("files", {
  id: uuid().primaryKey(),
  ownerId: uuid()
    .notNull()
    .references(() => users.id, {
      onUpdate: "cascade",
      onDelete: "restrict",
    }),
  key: text().notNull(),
  mimeType: text().notNull(),
  sizeBytes: integer().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull(),
});
