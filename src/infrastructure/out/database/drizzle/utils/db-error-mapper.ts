import { DrizzleQueryError } from "drizzle-orm";
import { DatabaseError } from "pg";
import { PG_CONNECTION_FAILED_ERROR } from "./db-error-codes";
import { InfrastructureError } from "@/domain/errors/infrastructure-errors";
import { ServiceUnavailableError } from "@/domain/errors/domain/service-unavailable-error";

export function pgMapper(map: Partial<Record<string, () => Error>>) {
  return (err: unknown) => {
    if (
      err instanceof Error &&
      err.cause instanceof DatabaseError &&
      err.cause.code
    ) {
      return map[err.cause.code]?.();
    }
  };
}
