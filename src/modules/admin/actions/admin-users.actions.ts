"use server";

import { error } from "console";
import {
  deleteUserById,
  getUserById,
  getUsers,
  PaginatedUsersResult,
  UsersListParams,
} from "../services/admin-user.service";
import { User } from "@prisma/client";

interface ActionResult<T> {
  success: boolean;
  data?: T | null;
  message?: string;
}

export async function getAdminUsersAction(
  params: UsersListParams,
): Promise<ActionResult<PaginatedUsersResult>> {
  try {
    const result = await getUsers(params);
    return {
      success: true,
      data: result,
      message: "Users fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}

// get user by id action can be added here in the future
export async function getAdminUserByIdAction(
  userId: string,
): Promise<ActionResult<User | null>> {
  try {
    // Assuming there's a getUserById service function
    if (!userId) {
      throw new Error("User ID is required");
    }
    const user = await getUserById(userId);
    return {
      success: true,
      data: user,
      message: "User fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch user",
    };
  }
}

// delete user action can be added here in the future
export async function deleteAdminUserAction(
  userId: string,
): Promise<ActionResult<null>> {
  try {
    // Assuming there's a deleteUser service function
    if (!userId) {
      throw new Error("User ID is required");
    }

    const existingUser = await getUserById(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    await deleteUserById(userId);
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
  }
  return {
    success: false,
    message: error instanceof Error ? error.message : "Failed to delete user",
  };
}
