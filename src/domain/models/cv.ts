import z from "zod";

// ===============================
// Schema & Types
// ===============================

export const cvContentPersonalInformationSchema = z.object({
  firstName: z.string().max(255).optional(),
  lastName: z.string().max(255).optional(),
  profile: z.string().max(255).optional(),
  websiteUrl: z.url().max(255).optional(),
  address: z.string().max(255).optional(),
  phone: z
    .string()
    .max(255)
    .regex(/^\+[1-9]\d{1,14}$/)
    .optional(),
  email: z.email().max(255).optional(),
});

export const cvContentSkillSchema = z.object({
  name: z.string().max(255),
  score: z.int().min(1).max(5),
});

export const cvContentEducationSchema = z.object({
  educationLevel: z.string().max(255),
  institution: z.string().max(255),
  city: z.string().max(255).optional(),
  studyProgram: z.string().max(255).optional(),
  startYear: z.int().min(1900).optional(),
  endYear: z.int().min(1900).optional(),
  score: z.number().optional(),
  maxScale: z.number().optional(),
});

export const cvContentWorkExperienceSchema = z.object({
  position: z.string().max(255),
  companyName: z.string().max(255),
  description: z.string().max(2000).optional(),
  employmentStatus: z.string().max(255),
  city: z.string().max(255).optional(),
  startYear: z.int().min(1900).optional(),
  endYear: z.int().min(1900).optional(),
});

export const cvContentCourseSchema = z.object({
  name: z.string().max(255),
  organizer: z.string().max(255),
  link: z.url().max(255).optional(),
  description: z.string().max(2000).optional(),
  startYear: z.number().min(1900).optional(),
  endYear: z.number().min(1900).optional(),
  location: z.string().max(255).optional(),
});

export const cvContentOrganizationSchema = z.object({
  position: z.string().max(255),
  organizationName: z.string().max(255),
  description: z.string().max(2000).optional(),
  city: z.string().max(255).optional(),
  startYear: z.number().min(1900).optional(),
  endYear: z.number().min(1900).optional(),
});

export const cvContentCertificateSchema = z.object({
  name: z.string().max(255),
  publisher: z.string().max(255),
  publishDate: z.coerce.date().optional(),
  verificationUrl: z.coerce.date().optional(),
  certificateNumber: z.string().optional(),
});

export const cvContentSchema = z.object({
  personalInformation: cvContentPersonalInformationSchema.optional(),
  skills: z.array(cvContentSkillSchema).optional(),
  educations: z.array(cvContentEducationSchema).optional(),
  workExperiences: z.array(cvContentWorkExperienceSchema).optional(),
  courses: z.array(cvContentCourseSchema).optional(),
  organziations: z.array(cvContentOrganizationSchema).optional(),
  certificates: z.array(cvContentCertificateSchema).optional(),
});

export type CvContent = z.infer<typeof cvContentSchema>;

export type CvData = {
  userId: string;
  content: CvContent;
};

// ===============================
// Entity
// ===============================

export class Cv {
  private readonly _userId: string;
  private readonly _content: CvContent;

  constructor(data: CvData) {
    this._userId = data.userId;
    this._content = data.content;
  }

  // ===============================
  // Domain
  // ===============================
  renderHtml() {}

  // ===============================
  // Persistence
  // ===============================
  toPersistence(): CvData {
    return {
      userId: this._userId,
      content: this._content,
    };
  }
}
