import { pgTable, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { posts } from "./posts";

export const userLikes = pgTable("user_likes", {
  userId: uuid()
    .primaryKey()
    .references(() => users.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  postId: uuid()
    .primaryKey()
    .references(() => posts.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
});
