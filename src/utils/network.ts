// 统一响应格式
export interface ApiResponse<T> {
  data: T | null
  code: number
  errors?: string[]
}

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// 成功响应
export const successResponse = <T>(data: T, code: number = 200): ApiResponse<T> => ({
  data,
  code,
})

// 错误响应
export const errorResponse = (errors: string[], code: number = 500): ApiResponse<null> => ({
  data: null,
  code,
  errors,
})