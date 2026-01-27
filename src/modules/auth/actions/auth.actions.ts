"use server";

import { signIn } from "@/shared/lib/auth";
import {
  createUser,
  getUserByEmail,
  hashPassword,
} from "../services/auth.service";
import {
  loginSchema,
  registerSchema,
  oauthProviderSchema,
  resetSchema,
  newPasswordSchema,
  type LoginFormData,
  type RegisterFormData,
  type OAuthProvider,
} from "../validations";
import { z } from "zod";
import type { UserRole } from "@prisma/client";
import {
  generatePasswordResetToken,
  getPasswordResetTokenByToken,
  generateEmailVerificationToken,
  getEmailVerificationByToken,
  deletePendingUserByToken,
} from "@/shared/lib/tokens";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/shared/lib/mail";
import { db } from "@/shared/lib/prisma";
import bcrypt from "bcryptjs";

// ========================================
// Types
// ========================================

interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

// ========================================
// Login Action
// ========================================

/**
 * Handle credentials login
 */
export async function loginAction(
  formData: LoginFormData,
): Promise<ActionResult> {
  try {
    // Validate input with Zod
    const validationResult = loginSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of validationResult.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(issue.message);
      }
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || "Validation failed",
        fieldErrors,
      };
    }

    const { email, password } = validationResult.data;

    // Attempt to sign in
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    // Re-throw redirect errors (next-auth uses these)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    // Handle authentication errors
    if (error instanceof Error) {
      // Check for common credential errors
      if (
        error.message.includes("Invalid") ||
        error.message.includes("credentials")
      ) {
        return { success: false, error: "Invalid email or password" };
      }
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unexpected error occurred" };
  }
}

// ========================================
// Register Action
// ========================================

/**
 * Handle user registration
 */
export async function registerAction(
  formData: RegisterFormData,
): Promise<ActionResult> {
  try {
    // Validate input with Zod
    const validationResult = registerSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of validationResult.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(issue.message);
      }
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || "Validation failed",
        fieldErrors,
      };
    }

    const { name, email, password, role, storeName } = validationResult.data;

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return {
        success: false,
        error: "An account with this email already exists",
        fieldErrors: { email: ["An account with this email already exists"] },
      };
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password);

    // Generate verification token and store pending user
    const pendingUser = await generateEmailVerificationToken({
      email,
      name,
      password: hashedPassword,
      role: role || "USER",
      storeName,
    });

    // Send verification email
    await sendVerificationEmail(email, pendingUser.token);

    return {
      success: true,
      message:
        "Verification email sent! Please check your inbox to verify your email address.",
    };
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof Error) {
      if (error.message === "NEXT_REDIRECT") {
        throw error;
      }
      return { success: false, error: error.message };
    }

    return { success: false, error: "Registration failed. Please try again." };
  }
}

// ========================================
// Email Verification Action
// ========================================

/**
 * Verify email and create user account
 */
export async function verifyEmailAction(
  token: string | null,
): Promise<ActionResult> {
  try {
    if (!token) {
      return { success: false, error: "Missing verification token" };
    }

    // Get pending user by token
    const pendingUser = await getEmailVerificationByToken(token);

    if (!pendingUser) {
      return { success: false, error: "Invalid or expired verification link" };
    }

    // Check if token has expired
    const hasExpired = new Date(pendingUser.expires) < new Date();
    if (hasExpired) {
      // Delete expired pending user
      await deletePendingUserByToken(token);
      return {
        success: false,
        error: "Verification link has expired. Please register again.",
      };
    }

    // Check if user already exists (edge case: user registered via OAuth after pending)
    const existingUser = await getUserByEmail(pendingUser.email);
    if (existingUser) {
      await deletePendingUserByToken(token);
      return {
        success: false,
        error: "An account with this email already exists",
      };
    }

    // Create the actual user
    await createUser(
      {
        name: pendingUser.name,
        email: pendingUser.email,
        password: pendingUser.password, // Already hashed
        role: pendingUser.role as UserRole,
        storeName: pendingUser.storeName || undefined,
      },
      true,
    ); // Pass true to skip password hashing

    // Update emailVerified field
    await db.user.update({
      where: { email: pendingUser.email.toLowerCase() },
      data: { emailVerified: new Date() },
    });

    // Delete pending user
    await deletePendingUserByToken(token);

    return {
      success: true,
      message: "Email verified successfully! You can now log in.",
    };
  } catch (error) {
    console.error("Email verification error:", error);

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Verification failed. Please try again." };
  }
}

// ========================================
// OAuth Actions
// ========================================

/**
 * Initiate OAuth sign-in
 */
export async function oauthLoginAction(provider: OAuthProvider) {
  // Validate provider
  const validationResult = oauthProviderSchema.safeParse(provider);

  if (!validationResult.success) {
    throw new Error("Invalid OAuth provider");
  }

  await signIn(validationResult.data, { redirectTo: "/" });
}

// ========================================
// Reset Password Actions
// ========================================

export const reset = async (values: z.infer<typeof resetSchema>) => {
  const validatedFields = resetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.identifier,
    passwordResetToken.token,
  );

  return { success: "Reset email sent!" };
};

export const newPassword = async (
  values: z.infer<typeof newPasswordSchema>,
  token: string | null,
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = newPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await db.verificationToken.delete({
    where: { token: existingToken.token },
  });

  return { success: "Password updated!" };
};
