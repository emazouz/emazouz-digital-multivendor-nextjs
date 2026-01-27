import { v4 as uuidv4 } from "uuid";
import { db } from "@/shared/lib/prisma";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.verificationToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.verificationToken.findFirst({
      where: { identifier: email },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: { token: existingToken.token },
    });
  }

  const passwordResetToken = await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};

// ========================================
// Email Verification Token Functions
// ========================================

/**
 * Get email verification pending user by token
 */
export const getEmailVerificationByToken = async (token: string) => {
  try {
    const pendingUser = await db.pendingUser.findUnique({
      where: { token },
    });

    return pendingUser;
  } catch {
    return null;
  }
};

/**
 * Get email verification pending user by email
 */
export const getEmailVerificationByEmail = async (email: string) => {
  try {
    const pendingUser = await db.pendingUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    return pendingUser;
  } catch {
    return null;
  }
};

/**
 * Generate email verification token and store pending user data
 */
export const generateEmailVerificationToken = async (data: {
  email: string;
  name: string;
  password: string;
}) => {
  const token = uuidv4();
  // Token expires in 24 hours
  const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  // Delete existing pending user if exists
  const existingPending = await getEmailVerificationByEmail(data.email);
  if (existingPending) {
    await db.pendingUser.delete({
      where: { email: data.email.toLowerCase() },
    });
  }

  // Create new pending user
  const pendingUser = await db.pendingUser.create({
    data: {
      email: data.email.toLowerCase(),
      name: data.name,
      password: data.password,
      role: "USER",
      token,
      expires,
    },
  });

  return pendingUser;
};

/**
 * Delete pending user by token (after verification)
 */
export const deletePendingUserByToken = async (token: string) => {
  try {
    await db.pendingUser.delete({
      where: { token },
    });
    return true;
  } catch {
    return false;
  }
};
