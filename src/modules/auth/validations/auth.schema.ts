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
    role: z.enum(["USER", "VENDOR", "ADMIN"], {
      message: "Please select a valid role",
    }),
    storeName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "VENDOR") {
        return !!data.storeName && data.storeName.trim().length > 0;
      }
      return true;
    },
    {
      message: "Store name is required for vendors",
      path: ["storeName"],
    },
  );

export type RegisterFormData = z.infer<typeof registerSchema>;

// ========================================
// OAuth Schema
// ========================================

export const oauthProviderSchema = z.enum(["google", "github"], {
  message: "Invalid OAuth provider",
});

export type OAuthProvider = z.infer<typeof oauthProviderSchema>;
