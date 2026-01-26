"use server";

import { signIn } from "@/shared/lib/auth";
import { createUser, getUserByEmail } from "../services/auth.service";
import {
  loginSchema,
  registerSchema,
  oauthProviderSchema,
  type LoginFormData,
  type RegisterFormData,
  type OAuthProvider,
} from "../validations";
import type { UserRole } from "@prisma/client";

// ========================================
// Types
// ========================================

interface ActionResult {
  success: boolean;
  error?: string;
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

    console.log("Register action called with data:", formData);

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

    // Create the user
    await createUser({
      name,
      email,
      password,
      role: role as UserRole,
      storeName,
    });

    // Auto-login after registration
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
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
