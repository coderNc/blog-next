import bcrypt from 'bcrypt';
import prisma from '@/src/lib/db';
import { errorResponse, successResponse } from '@/src/utils/network';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true }
    });

    if (!user) {
      return Response.json(errorResponse(['用户不存在']), { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return Response.json(errorResponse(['用户名或密码错误']), { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return Response.json(successResponse({
      token,
      expiresIn: 3600
    }));
  } catch (error) {
    return Response.json(
      errorResponse(['登录失败', error + ''], 500),
      { status: 500 }
    );
  }
}