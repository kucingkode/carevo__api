import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const cvs = pgTable("cvs", {
  userId: uuid()
    .primaryKey()
    .references(() => users.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  skills: jsonb().notNull().default([]),
  personalInformation: jsonb().notNull().default({}),
  educations: jsonb().notNull().default([]),
  workExperiences: jsonb().notNull().default([]),
  courses: jsonb().notNull().default([]),
  organizations: jsonb().notNull().default([]),
  certifications: jsonb().notNull().default([]),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
});
