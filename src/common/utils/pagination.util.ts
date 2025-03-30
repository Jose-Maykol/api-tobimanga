import { Pagination } from "../interfaces/pagination.interface"

export const calculatePagination = (
  total: number,
  page: number,
  limit: number,
): Pagination => {
  const pages = Math.ceil(total / limit)
  return {
    total,
    perPage: limit,
    currentPage: page,
    pages,
    hasNextPage: page < pages,
    hasPreviousPage: page > 1,
  }
}