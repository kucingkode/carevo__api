import {
  check,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { communities } from "./communities";
import { sql } from "drizzle-orm";

export const posts = pgTable(
  "posts",
  {
    id: uuid().primaryKey(),
    userId: uuid()
      .notNull()
      .references(() => users.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    communityId: uuid()
      .notNull()
      .references(() => communities.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    content: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull(),
  },
  (t) => [
    // checks
    check("content_length", sql`char_length(${t.content}) <= 2000`),

    // indexes
    index("idx_user_id").on(t.userId),
    index("idx_community_id").on(t.communityId),
  ],
);
