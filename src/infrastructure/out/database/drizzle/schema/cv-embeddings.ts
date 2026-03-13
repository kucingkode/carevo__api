import { pgTable, timestamp, uuid, vector } from "drizzle-orm/pg-core";
import { users } from "./users";

export const cvEmbeddings = pgTable("cv_embeddings", {
  userId: uuid()
    .primaryKey()
    .references(() => users.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  embedding: vector({ dimensions: 1536 }).notNull(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
});
