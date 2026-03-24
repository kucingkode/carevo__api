import { AI_GENERATE_CV_USE_CASE } from "@/constants";
import type {
  AiGenerateCvInput,
  AiGenerateCvUseCase,
} from "@/domain/ports/in/cvs/ai-generate-cv";
import type { LlmProvider } from "@/domain/ports/out/llm-provider";
import { BaseUseCase } from "@/shared/classes/base-use-case";

const LLM_MODEL = "gpt-5.4-nano";
const LLM_TEMPERATURE = 0.7;

const systemContents = {
  PROFILE: `
Kamu adalah generator profile/summary CV.
Balas dengan satu paragraf konten plain text prfoesional untuk profile/summary yang siap di salin ke CV.
Gunakan pesan pengguna sebagai landasan informasi.
`,

  WORK_EXPERIENCE_DESCRIPTION: `
Kamu adalah generator deskripsi pengalaman kerja pada CV.
Balas dengan satu paragraf konten plain text prfoesional untuk deskripsi pengalaman kerja yang siap di salin ke CV.
Gunakan pesan pengguna sebagai landasan informasi.
`,

  ORGANIZATION_DESCRIPTION: `
Kamu adalah generator deskripsi pengalaman organisasi pada CV.
Balas dengan satu paragraf konten plain text prfoesional untuk deskripsi pengalaman organisasi yang siap di salin ke CV.
Gunakan pesan pengguna sebagai landasan informasi.
`,

  COURSE_DESCRIPTION: `
Kamu adalah generator deskripsi pengalaman kursus pada CV.
Balas dengan satu paragraf konten plain text prfoesional untuk deskripsi pengalaman kursus yang siap di salin ke CV.
Gunakan pesan pengguna sebagai landasan informasi.
`,

  EDUCATION_DESCRIPTION: `
Kamu adalah generator deskripsi riwayat edukasi pada CV.
Balas dengan satu paragraf konten plain text prfoesional untuk deskripsi riwayat edukasi yang siap di salin ke CV.
Gunakan pesan pengguna sebagai landasan informasi.
`,
} as const;

export type AiGenerateCvServiceDeps = {
  llmProvider: LlmProvider;
};

export class AiGenerateCvService
  extends BaseUseCase
  implements AiGenerateCvUseCase
{
  private readonly llmProvider: LlmProvider;

  constructor(deps: AiGenerateCvServiceDeps) {
    super(AI_GENERATE_CV_USE_CASE);

    this.llmProvider = deps.llmProvider;
  }

  aiGenerateCv(input: AiGenerateCvInput): AsyncIterable<string> {
    return this.llmProvider.generate({
      model: LLM_MODEL,
      messages: [
        {
          role: "system",
          content: systemContents[input.section],
        },
        {
          role: "user",
          content: input.input,
        },
      ],
      temperature: LLM_TEMPERATURE,
    });
  }
}
