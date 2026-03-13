import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  check,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid().primaryKey(),
    username: text().notNull().unique(),
    email: text().notNull().unique(),
    isEmailVerified: boolean().notNull(),
    passwordHash: text(),
    googleId: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("username_length", sql`char_length(${t.username}) <= 30`),
    check("email_length", sql`char_length(${t.email}) <= 255`),
  ],
);
