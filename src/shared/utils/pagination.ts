export function getPagination(
  page?: number,
  limit?: number,
  defaultLimit: number = 20,
) {
  const finalLimit = limit ?? defaultLimit;
  const finalPage = page ?? 1;

  return {
    offset: (finalPage - 1) * 100,
    limit: finalLimit,
  };
}
