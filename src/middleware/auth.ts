import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 跳过公开路由
  if (path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const token = request.headers.get('authorization')?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json(
      { error: '未经授权的访问' },
      { status: 401 }
    );
  }

  try {
    // 假设 jwt.verify 返回的对象有 userId 属性，定义一个接口来明确类型
    interface DecodedToken {
      userId: string;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: '无效的访问令牌' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ['/api/:path*']
};