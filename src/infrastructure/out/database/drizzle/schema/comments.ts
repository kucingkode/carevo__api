import { sql } from "drizzle-orm";
import { check, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const comments = pgTable(
  "comments",
  {
    id: uuid().primaryKey(),
    userId: uuid()
      .notNull()
      .references(() => users.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    postId: uuid().notNull(),
    parentId: uuid(),
    content: text(),
    createdAt: timestamp({ withTimezone: true }).notNull(),
  },
  (t) => [check("content_length", sql`char_length(${t.content}) <= 2000`)],
);
