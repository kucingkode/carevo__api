import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const cvs = pgTable("cvs", {
  userId: uuid().references(() => users.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  skills: jsonb().notNull(),
  personalInfo: jsonb().notNull(),
  educations: jsonb().notNull(),
  workExperiences: jsonb().notNull(),
  courses: jsonb().notNull(),
  organizations: jsonb().notNull(),
  certifications: jsonb().notNull(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
});
