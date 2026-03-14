import type { Logger } from "@/observability/logging";
import { createUseCaseLogger } from "../utils/create-use-case-logger";

export class BaseUseCase {
  protected readonly log: Logger;

  constructor(useCase: string) {
    this.log = createUseCaseLogger(this.constructor.name, useCase);
  }
}
