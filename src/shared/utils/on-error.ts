import { DomainError } from "@/domain/errors/domain/domain-error";
import { InfrastructureError } from "@/domain/errors/infrastructure-errors";

export async function onError<T>(
  fn: () => Promise<T> | T,
  handler: (err: unknown) => Error | undefined,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof DomainError) throw err;
    if (err instanceof InfrastructureError) throw err;

    const mapped = handler(err);
    if (mapped) throw mapped;
    throw err;
  }
}
