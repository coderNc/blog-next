import bcrypt from "bcrypt";
import prisma from "@/src/lib/db";
import { errorResponse, PaginatedResponse, successResponse } from "@/src/utils/network";
import { ERROR_CODES } from "@/src/utils/errorCodes";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  try {
    if (id) {
      // 提供了 id 参数，获取单个用户
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });
      if (!user) {
        return Response.json(errorResponse([ERROR_CODES.AUTH_003.code]), { status: 404 });
      }
      return Response.json(successResponse(user));
    } else {
      // 没有提供 id 参数，获取所有用户
      const curPage = Number(searchParams.get("page")) || 1;
      const pageSize = Number(searchParams.get("pageSize")) || 10;
      const users = await prisma.user.findMany({
        skip: (curPage - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });
      const total = await prisma.user.count();
      const totalPages = Math.ceil(total / pageSize);
      return Response.json(
        successResponse<PaginatedResponse<typeof users[0]>>({
          items: users,
          meta: {
            total,
            page: curPage,
            limit: pageSize,
            totalPages
          }
        })
    );
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      errorResponse([ERROR_CODES.SERVER_001.code]),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { username, email, id, password } = await request.json();
  try {
    const errors: string[] = [];
    if (!username) errors.push(ERROR_CODES.VALIDATION_001.code);
    if (!email) errors.push(ERROR_CODES.VALIDATION_002.code);
    if (!password) errors.push(ERROR_CODES.VALIDATION_003.code);
    if (errors.length) {
      return Response.json(errorResponse(errors, 400), { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (id) {
      // 提供了 id 参数，更新用户
      const user = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          username,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          role: true,
        },
      });
      return Response.json(successResponse(user));
    } else {
      // 没有提供 id 参数，创建新用户
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });
      return Response.json(successResponse(user));
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      errorResponse([ERROR_CODES.SERVER_001.code]),
      { status: 500 }
    );
  }
}
