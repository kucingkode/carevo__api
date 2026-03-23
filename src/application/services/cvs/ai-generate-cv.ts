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
  PROFILE:
    "Kamu adalah generator profile/summary CV, tulis profile/summary CV profesional dari pesan pengguna yang berisi profile/summary mereka.",
  WORK_EXPERIENCE_DESCRIPTION:
    "Kamu adalah generator deskripsi pengalaman kerja pada CV, tulis deskripsi profesional dari pengalaman kerja pengguna berdasarkan informasi yang tertera pada pesan mereka.",
  ORGANIZATION_DESCRIPTION:
    "Kamu adalah generator deskripsi pengalaman organisasi pada CV, tulis deskripsi profesional dari pengalaman organisasi pengguna yang terbaik berdasarkan informasi yang tertera pada pesan mereka.",
  COURSE_DESCRIPTION:
    "Kamu adalah generator deskripsi pengalaman kursus pada CV, tulis deskripsi profesional dari kursus yang telah diikuti pengguna berdasarkan informasi yang tertera pada pesan mereka.",
  EDUCATION_DESCRIPTION:
    "Kamu adalah generator deskripsi riwayat pendidikan pada CV, tulis deskripsi profesional dari riwaat pendidikan yang telah ditempuh pengguna berdasarkan informasi yang tertera pada pesan mereka.",
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
