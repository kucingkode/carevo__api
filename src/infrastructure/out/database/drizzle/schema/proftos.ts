import {
  check,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { files } from "./files";
import { relations, sql } from "drizzle-orm";

export const proftos = pgTable(
  "proftos",
  {
    userId: uuid()
      .primaryKey()
      .references(() => users.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    name: text(),
    professionRole: text(),
    lastEducation: text(),
    email: text(),
    summary: text(),
    avatarFileId: uuid().references(() => files.id, {
      onUpdate: "cascade",
    }),
    cvFileId: uuid().references(() => files.id, {
      onUpdate: "cascade",
    }),
    certificates: jsonb().notNull().default([]),
    experiences: jsonb().notNull().default([]),
    projects: jsonb().notNull().default([]),
    links: jsonb().notNull().default([]),
    updatedAt: timestamp({ withTimezone: true }).notNull(),
  },
  (t) => [
    check("name_length", sql`char_length(${t.name}) <= 255`),
    check(
      "profession_role_length",
      sql`char_length(${t.professionRole}) <= 255`,
    ),
    check("last_education_length", sql`char_length(${t.lastEducation}) <= 255`),
    check("email_length", sql`char_length(${t.email}) <= 255`),
    check("summary_length", sql`char_length(${t.summary}) <= 2000`),
  ],
);

export const proftosRelations = relations(proftos, ({ one }) => ({
  user: one(users, {
    fields: [proftos.userId],
    references: [users.id],
  }),
}));
