import {
  professionRoleSchema,
  type ProfessionRole,
} from "@/shared/schemas/zod/profession-role-schema";
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
  professionRole: professionRoleSchema,
  imageFileId: z.uuidv7(),
  date: z.iso.date(),
  description: z.string().max(2000),
});

export type ProftoProject = z.infer<typeof proftoProjectSchema>;

export const proftoLinkSchema = z.object({
  name: z.string().max(255),
  url: z.url().max(500),
});

export type ProftoLink = z.infer<typeof proftoLinkSchema>;

export const proftoBaseSchema = z.object({
  avatarFileId: z.uuidv7().nullable(),
  name: z.string().max(255).nullable(),
  professionRole: professionRoleSchema.nullable(),
  lastEducation: z.string().max(255).nullable(),
  email: z.email().max(255).nullable(),
  summary: z.string().max(2000).nullable(),
  cvFileId: z.uuidv7().nullable(),
  certificates: z.array(proftoCertificateSchema),
  experiences: z.array(proftoExperienceSchema),
  projects: z.array(proftoProjectSchema),
  links: z.array(proftoLinkSchema),
});

export type ProftoBase = z.infer<typeof proftoBaseSchema>;

export type ProftoProps = ProftoBase & {
  userId: string;
  updatedAt: Date;
};

// update schema
export const proftoPartialUpdateSchema = proftoBaseSchema.partial();
export type ProftoPartialUpdate = z.infer<typeof proftoPartialUpdateSchema>;

export class Profto {
  private readonly _userId: string;
  private _avatarFileId: string | null;
  private _cvFileId: string | null;
  private _email: string | null;
  private _lastEducation: string | null;
  private _name: string | null;
  private _professionRole: ProfessionRole | null;
  private _summary: string | null;
  private _certificates: ProftoCertificate[];
  private _links: ProftoLink[];
  private _projects: ProftoProject[];
  private _experiences: ProftoExperience[];
  private _updatedAt: Date;

  private constructor(props: ProftoProps) {
    this._userId = props.userId;
    this._avatarFileId = props.avatarFileId;
    this._cvFileId = props.cvFileId;
    this._email = props.email;
    this._lastEducation = props.lastEducation;
    this._name = props.name;
    this._professionRole = props.professionRole;
    this._summary = props.summary;
    this._certificates = props.certificates;
    this._links = props.links;
    this._projects = props.projects;
    this._experiences = props.experiences;
    this._updatedAt = props.updatedAt;
  }

  // ===============================
  // Factory
  // ===============================

  static create(userId: string) {
    return new Profto({
      userId,
      avatarFileId: null,
      cvFileId: null,
      email: null,
      lastEducation: null,
      name: null,
      professionRole: null,
      summary: null,
      certificates: [],
      links: [],
      projects: [],
      experiences: [],
      updatedAt: new Date(),
    });
  }

  static rehydrate(props: ProftoProps) {
    return new Profto(props);
  }

  // ===============================
  // Persistence
  // ===============================

  toPersistence(): ProftoProps {
    return {
      userId: this._userId,
      avatarFileId: this._avatarFileId,
      cvFileId: this._cvFileId,
      email: this._email,
      lastEducation: this._lastEducation,
      name: this._name,
      professionRole: this._professionRole,
      summary: this._summary,
      certificates: this._certificates,
      links: this._links,
      projects: this._projects,
      experiences: this._experiences,
      updatedAt: this._updatedAt,
    };
  }
}
