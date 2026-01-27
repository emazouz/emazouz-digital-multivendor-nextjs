"use server";

import prisma from "@/shared/lib/prisma";
import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";

// ========================================
// User Lookup
// ========================================

/**
 * Find a user by their email address
 */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email },
  });
}

/**
 * Find a user by their ID
 */
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

// ========================================
// Password Utilities
// ========================================

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ========================================
// User Creation
// ========================================

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

/**
 * Create a new user account
 * @param skipHashing - If true, password is already hashed (for email verification flow)
 */
export async function createUser(data: CreateUserData, skipHashing = false) {
  const { name, email, password, role = "USER" } = data;

  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash the password (unless already hashed)
  const hashedPassword = skipHashing ? password : await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email: email,
      password: hashedPassword,
      role,
    },
  });

  return user;
}
