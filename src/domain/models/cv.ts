import z from "zod";

export const cvContentPersonalInformationSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profile: z.string().optional(),
  websiteUrl: z.url().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.email().optional(),
});

export const cvContentSkillSchema = z.object({
  name: z.string(),
  score: z.int().min(1).max(5),
});

export const cvContentEducationSchema = z.object({
  educationLevel: z.string(),
  institution: z.string(),
  city: z.string().optional(),
  studyProgram: z.string().optional(),
  startYear: z.int().optional(),
  endYear: z.int().optional(),
  score: z.number().optional(),
  maxScale: z.number().optional(),
});

export const cvContentWorkExperienceSchema = z.object({
  position: z.string(),
  companyName: z.string(),
  description: z.string().optional(),
  employmentStatus: z.string(),
  city: z.string().optional(),
  startYear: z.int().optional(),
  endYear: z.int().optional(),
});

export const cvContentCourseSchema = z.object({
  name: z.string(),
  organizer: z.string(),
  link: z.url().optional(),
  description: z.string().optional(),
  startYear: z.number().optional(),
  endYear: z.number().optional(),
  location: z.string().optional(),
});

export const cvContentOrganizationSchema = z.object({
  position: z.string(),
  organizationName: z.string(),
  description: z.string().optional(),
  city: z.string().optional(),
  startYear: z.number().optional(),
  endYear: z.number().optional(),
});

export const cvContentCertificateSchema = z.object({
  name: z.string(),
  publisher: z.string(),
  publishDate: z.coerce.date().optional(),
  verificationUrl: z.coerce.date().optional(),
  certificateNumber: z.number().optional(),
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
