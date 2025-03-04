import bcrypt from 'bcrypt';
import prisma from '@/src/lib/db';
import { errorResponse, successResponse } from '@/src/utils/network';
import jwt from 'jsonwebtoken';
import { ERROR_CODES } from '@/src/utils/errorCodes';
export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true }
    });

    if (!user) {
      return Response.json(errorResponse([ERROR_CODES.AUTH_003.code]), { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return Response.json(errorResponse([ERROR_CODES.AUTH_004.code]), { status: 401 });
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
    console.error(error);
    return Response.json(
      errorResponse([ERROR_CODES.SERVER_001.code]),
      { status: 500 }
    );
  }
}