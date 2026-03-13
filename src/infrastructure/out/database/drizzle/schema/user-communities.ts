import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { communities } from "./communities";

export const userCommunities = pgTable(
  "user_communities",
  {
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
  },
  (t) => [primaryKey({ columns: [t.userId, t.communityId] })],
);
