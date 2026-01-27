import { z } from "zod";

// ========================================
// Login Schema
// ========================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  keepSignedIn: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ========================================
// Register Schema
// ========================================

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// ========================================
// OAuth Schema
// ========================================

export const oauthProviderSchema = z.enum(["google", "github"], {
  message: "Invalid OAuth provider",
});

export type OAuthProvider = z.infer<typeof oauthProviderSchema>;

export const resetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const newPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});
