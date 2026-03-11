import z from "zod";

export const proftoContentCertificateSchema = z.object({
  imageFileId: z.string(),
  name: z.string(),
  publishDate: z.date(),
  publisher: z.string(),
});

export const proftoContentExperienceSchema = z.object({
  name: z.string(),
  startYear: z.int(),
  endYear: z.int(),
  description: z.string(),
});

export const proftoContentProjectSchema = z.object({
  name: z.string(),
  professionRole: z.string(),
  imageFileId: z.string(),
  date: z.coerce.date(),
  description: z.string(),
});

export const proftoContentLinkSchema = z.object({
  name: z.string(),
  link: z.string(),
});

export const proftoContentSchema = z.object({
  avatarFileId: z.uuidv7().optional(),
  name: z.string().optional(),
  professionRole: z.string().optional(),
  lastEducation: z.string().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  summary: z.string().optional(),
  cvFileId: z.uuidv7().optional(),
  certificates: z.array(proftoContentCertificateSchema).optional(),
  experiences: z.array(proftoContentExperienceSchema).optional(),
  projects: z.array(proftoContentProjectSchema).optional(),
  links: z.array(proftoContentLinkSchema).optional(),
});

export type ProftoContent = z.infer<typeof proftoContentSchema>;

export type ProftoData = {
  userId: string;
  content: ProftoContent;
};

export type ProftoSummary = {
  userId: string;
  username: string;
  name: string;
  avatarFileId: string;
};

export class Profto {
  private readonly _userId: string;
  private readonly _content: ProftoContent;

  constructor(data: ProftoData) {
    this._userId = data.userId;
    this._content = data.content;
  }

  // ===============================
  // Persistence
  // ===============================
  toPersistence(): ProftoData {
    return {
      userId: this._userId,
      content: this._content,
    };
  }
}
