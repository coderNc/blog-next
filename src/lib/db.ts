// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

// 类型安全地扩展全局类型
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// 初始化函数
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// 生产环境直接创建实例，开发环境复用全局实例
const prisma = globalThis.prisma ?? prismaClientSingleton()

// 开发模式热重载时保持单例
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// 导出类型化的 Prisma 实例
export default prisma

// 可选：导出 Prisma 类型
export type { Prisma } from '@prisma/client'