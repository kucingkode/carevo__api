import { sql } from "drizzle-orm";
import {
  check,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
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
    content: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull(),
  },
  (t) => [
    // checks
    check("content_length", sql`char_length(${t.content}) <= 2000`),

    // indexes
    index("idx_comments_user_id").on(t.userId),
    index("idx_comments_post_id_parent_id").on(t.postId, t.parentId),
  ],
);
