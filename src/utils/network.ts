// 统一响应格式
import { ErrorCodeType, ERROR_CODES } from './errorCodes';
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

export const errorResponse = (
  codes: ErrorCodeType[],
  status?: number
): ApiResponse<null> => {
  const firstCode = codes[0];
  const errorInfo = ERROR_CODES[firstCode] || ERROR_CODES.SERVER_001;
  
  return {
    data: null,
    code: status || errorInfo.status,
    errors: codes.map(code => ERROR_CODES[code]?.message || ERROR_CODES.SERVER_001.message)
  };
};
