export interface Pagination {
  total: number
  perPage: number
  currentPage: number
  pages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
