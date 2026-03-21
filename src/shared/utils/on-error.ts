import { DomainError } from "@/domain/errors/domain/domain-error";

export async function onError<T>(
  fn: () => Promise<T> | T,
  handler: (err: unknown) => Error | undefined,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof DomainError) throw err;

    const mapped = handler(err);
    if (mapped) throw mapped;
    throw err;
  }
}
