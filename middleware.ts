import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { errorResponse } from '@/src/utils/network';

interface DecodedToken {
  userId: string;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('✅ 中间件已触发，路径:', request.nextUrl.pathname);
  console.log('Auth Header:', request.headers.get('authorization'));
  // 跳过公开路由
  if (path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const token = request.headers.get('authorization')?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json(errorResponse(['未经授权的访问'], 401));
  }

  try {
    // 使用 jose 的异步验证方法
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const decoded = payload as unknown as DecodedToken;
    // 创建新的响应对象并设置 header
    const response = NextResponse.next();
    response.headers.set('x-user-id', decoded.userId);
    return response;
} catch (error) {
    console.error(error);
    return NextResponse.json(errorResponse(['无效的访问令牌'], 401));
}
}

export const config = {
  matcher: ['/api/:path*']
};