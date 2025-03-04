type ErrorCode = {
  code: string;
  status: number;
  message: string;
};

// 错误码映射表
export const ERROR_CODES: Record<string, ErrorCode> = {
  // 认证相关
  AUTH_001: {
    code: 'AUTH_001',
    status: 401,
    message: '未经授权的访问'
  },
  AUTH_002: {
    code: 'AUTH_002',
    status: 401,
    message: '无效的访问令牌'
  },
  AUTH_003: {
    code: 'AUTH_003',
    status: 404,
    message: '用户不存在'
  },
  AUTH_004: {
    code: 'AUTH_004',
    status: 401,
    message: '用户名或密码错误'
  },

  // 数据验证相关
  VALIDATION_001: {
    code: 'VALIDATION_001',
    status: 400,
    message: '用户名不能为空'
  },
  VALIDATION_002: {
    code: 'VALIDATION_002',
    status: 400,
    message: '邮箱不能为空'
  },
  // 数据验证相关
  VALIDATION_003: {
    code: 'VALIDATION_003',
    status: 400,
    message: '密码不能为空'
  },

  // 数据库相关
  DB_001: {
    code: 'DB_001',
    status: 500,
    message: '数据库操作失败'
  },
  //服务器相关
  SERVER_001: {
    code: 'SERVER_001',
    status: 500,
    message: '服务器内部错误'
  }
};

// 状态码映射
export const STATUS_CODE_MAP: Record<number, string> = {
  400: '请求参数错误',
  401: '未授权访问',
  500: '服务器内部错误'
};

export type ErrorCodeType = keyof typeof ERROR_CODES;