import z from "zod";

// ===============================
// Schema & Types
// ===============================

export const proftoCertificateSchema = z.object({
  imageFileId: z.uuidv7(),
  name: z.string().max(255),
  publishDate: z.date(),
  publisher: z.string().max(255),
});

export type ProftoCertificate = z.infer<typeof proftoCertificateSchema>;

export const proftoExperienceSchema = z.object({
  name: z.string().max(255),
  startYear: z.int().min(1900),
  endYear: z.int().min(1900),
  description: z.string().max(2000),
});

export type ProftoExperience = z.infer<typeof proftoExperienceSchema>;

export const proftoProjectSchema = z.object({
  name: z.string().max(255),
  professionRole: z.string().max(255),
  imageFileId: z.uuidv7(),
  date: z.coerce.date(),
  description: z.string().max(2000),
});

export type ProftoProject = z.infer<typeof proftoProjectSchema>;

export const proftoLinkSchema = z.object({
  name: z.string().max(255),
  link: z.string().max(255),
});

export type ProftoLink = z.infer<typeof proftoLinkSchema>;

export const proftoDataSchema = z.object({
  userId: z.uuidv7(),
  avatarFileId: z.uuidv7().nullable(),
  name: z.string().max(255).nullable(),
  professionRole: z.string().max(255).nullable(),
  lastEducation: z.string().max(255).nullable(),
  email: z.email().max(255).nullable(),
  summary: z.string().max(2000).nullable(),
  cvFileId: z.uuidv7().nullable(),
  certificates: z.array(proftoCertificateSchema),
  experiences: z.array(proftoExperienceSchema),
  projects: z.array(proftoProjectSchema),
  links: z.array(proftoLinkSchema),
});

export type ProftoData = z.infer<typeof proftoDataSchema>;

export type ProftoSummary = {
  userId: string;
  username: string;
  name: string;
  avatarFileId: string;
  professionRole: string;
};
