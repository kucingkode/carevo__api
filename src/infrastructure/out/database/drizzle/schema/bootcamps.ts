import { sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";

export const bootcamps = pgTable(
  "bootcamps",
  {
    id: uuid().primaryKey(),
    name: text().notNull(),
    professionRole: text().notNull(),
    thumbnailUrl: uuid().notNull(),
    redirectUrl: text().notNull(),
    publisher: text().notNull(),
    startDate: date().notNull(),
    embedding: vector({ dimensions: 1536 }).notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // checks
    check("name_length", sql`char_length(${t.name}) <= 255`),
    check(
      "profession_role_length",
      sql`char_length(${t.professionRole}) <= 255`,
    ),
    check("publisher_length", sql`char_length(${t.publisher}) <= 500`),

    // indexes
    index("idx_bootcamps_embedding").using(
      "hnsw",
      t.embedding.op("vector_cosine_ops"),
    ),
  ],
);
