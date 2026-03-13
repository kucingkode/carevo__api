import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { posts } from "./posts";

export const userLikes = pgTable(
  "user_likes",
  {
    userId: uuid()
      .notNull()
      .references(() => users.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    postId: uuid()
      .notNull()
      .references(() => posts.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.postId] })],
);
