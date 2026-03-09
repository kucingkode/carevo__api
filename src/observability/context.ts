import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

export const requestContext = new AsyncLocalStorage<RequestContext>();

export function runWithContext<T>(fn: () => T): T {
  return requestContext.run(
    {
      requestId: randomUUID(),
    },
    fn,
  );
}

export type RequestContext = {
  requestId?: string;
};
