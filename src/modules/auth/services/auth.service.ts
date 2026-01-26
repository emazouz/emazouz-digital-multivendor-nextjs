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
    where: { email: email.toLowerCase() },
    include: {
      vendor: true,
    },
  });
}

/**
 * Find a user by their ID
 */
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      vendor: true,
    },
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
  role: UserRole;
  storeName?: string;
}

/**
 * Create a new user account
 * If role is VENDOR, also creates a Vendor record
 */
export async function createUser(data: CreateUserData) {
  const { name, email, password, role, storeName } = data;

  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create user with optional vendor
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      ...(role === "VENDOR" &&
        storeName && {
          vendor: {
            create: {
              storeName,
              slug: generateSlug(storeName),
            },
          },
        }),
    },
    include: {
      vendor: true,
    },
  });

  return user;
}

// ========================================
// Utility Functions
// ========================================

/**
 * Generate a URL-friendly slug from a string
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .concat("-", Date.now().toString(36));
}
