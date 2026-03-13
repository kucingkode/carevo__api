import { sql } from "drizzle-orm";
import { check, date, pgTable, text, uuid, vector } from "drizzle-orm/pg-core";

export const bootcamps = pgTable(
  "bootcamps",
  {
    id: uuid().primaryKey(),
    name: text().notNull(),
    professionRole: text().notNull(),
    thumbnailFileId: uuid().notNull(),
    redirectUrl: text().notNull(),
    publisher: text().notNull(),
    startDate: date().notNull(),
    embedding: vector({ dimensions: 1536 }),
  },
  (t) => [
    check("name_length", sql`char_length(${t.name}) <= 255`),
    check(
      "profession_role_length",
      sql`char_length(${t.professionRole}) <= 255`,
    ),
    check("publisher_length", sql`char_length(${t.publisher}) <= 500`),
  ],
);
