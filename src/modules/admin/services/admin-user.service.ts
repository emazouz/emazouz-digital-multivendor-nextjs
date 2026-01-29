import prisma from "@/shared/lib/prisma";
import { User, UserRole } from "@prisma/client";

export interface PaginatedResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedUsersResult {
  users: User[];
  paginated: PaginatedResult;
}


export const getUsers = async (
  params: UsersListParams = {},
): Promise<PaginatedUsersResult> => {
  const {
    page = 1,
    limit = 10,
    search,
    role,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const offset = (page - 1) * limit;
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (role) {
    where.role = role;
  }

  const total = await prisma.user.count({ where });

  const users = await prisma.user.findMany({
    where,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip: offset,
    take: limit,
  });

  return {
    users: users,
    paginated: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// get user by id
export const getUserById = async (
  userId: string,
): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user || null;
};

// delete user by id
export const deleteUserById = async (userId: string): Promise<void> => {
  await prisma.user.delete({
    where: { id: userId },
  });
};
