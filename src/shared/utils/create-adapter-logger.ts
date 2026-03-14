import { getLogger } from "@/observability/logging";

export function createAdapterLogger(
  component: string,
  port: string,
  direction: string,
) {
  return getLogger().child({
    component,
    port,
    direction,
  });
}
