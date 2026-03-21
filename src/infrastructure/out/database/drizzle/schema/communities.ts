import { sql } from "drizzle-orm";
import { check, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { files } from "./files";

export const communities = pgTable(
  "communities",
  {
    id: uuid().primaryKey(),
    avatarFileId: uuid()
      .notNull()
      .references(() => files.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    name: text().notNull(),
    description: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("name_length", sql`char_length(${t.name}) <= 255`),
    check("description_length", sql`char_length(${t.description}) <= 2000`),
  ],
);
