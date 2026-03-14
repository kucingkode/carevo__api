import { AI_GENERATE_CV_USE_CASE } from "@/constants";
import type {
  AiGenerateCvInput,
  AiGenerateCvUseCase,
} from "@/domain/ports/in/cvs/ai-generate-cv";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type AiGenerateCvServiceParams<TxCtx extends TxContext<any>> = {};

export class AiGenerateCvService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements AiGenerateCvUseCase
{
  constructor(params: AiGenerateCvServiceParams<TxCtx>) {
    super(AI_GENERATE_CV_USE_CASE);
  }

  aiGenerateCv(input: AiGenerateCvInput): AsyncIterable<string> {
    throw new Error("not implemented");
  }
}
