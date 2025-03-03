import bcrypt from 'bcrypt';
import prisma from '@/src/lib/db';
import { errorResponse, successResponse } from '@/src/utils/network';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      const errors = [];
      if (existingUser.email === email) errors.push('邮箱已被注册');
      if (existingUser.username === username) errors.push('用户名已被占用');
      return Response.json(errorResponse(errors), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    });

    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return Response.json(successResponse({
      token,
      expiresIn: 3600,
      user: newUser
    }));
  } catch (error) {
    return Response.json(
      errorResponse(['注册失败', error + ''], 500),
      { status: 500 }
    );
  }
}