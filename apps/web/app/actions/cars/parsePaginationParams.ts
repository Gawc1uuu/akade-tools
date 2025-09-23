export async function parsePaginationParams(searchParams: Record<string, string>, paramName: string) {
  const pageParam = searchParams[`${paramName}Page`];
  const pageSizeParam = searchParams[`${paramName}PageSize`];

  const page = pageParam ? parseInt(pageParam) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam) : 10;

  return {
    page,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  };
}
