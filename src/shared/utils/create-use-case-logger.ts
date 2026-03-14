import { getLogger } from "@/observability/logging";

export function createUseCaseLogger(component: string, useCase: string) {
  return getLogger().child({
    component,
    useCase,
  });
}
