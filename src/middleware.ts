// middleware.ts

import { NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";

// Use Node.js runtime instead of Edge runtime
// Required because bcryptjs and Prisma don't support Edge runtime
export const runtime = "nodejs";

// ========================================
// Route Configuration
// ========================================

/**
 * Public routes - accessible by anyone
 */
const publicRoutes = [
  "/",
  "/products",
  "/categories",
  "/about",
  "/contact",
  "/faq",
];

/**
 * Auth routes - only accessible by unauthenticated users
 */
const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
];

/**
 * Protected routes - require authentication
 */
const protectedRoutes = [
  "/profile",
  "/orders",
  "/wishlist",
  "/checkout",
  "/settings",
];

/**
 * Admin routes - require authentication + admin role
 */
const adminRoutes = ["/admin"];

/**
 * API auth routes - always allowed (for NextAuth)
 */
const apiAuthPrefix = "/api/auth";

/**
 * Default redirect paths
 */
const DEFAULT_LOGIN_REDIRECT = "/";
const LOGIN_PATH = "/auth/login";
const ADMIN_LOGIN_PATH = "/auth/login";
const UNAUTHORIZED_PATH = "/";

// ========================================
// Helper Functions
// ========================================

/**
 * Check if a path matches any route in the list
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    // Exact match
    if (pathname === route) return true;
    // Prefix match for nested routes
    if (pathname.startsWith(`${route}/`)) return true;
    return false;
  });
}

/**
 * Check if path is a public route
 */
function isPublicRoute(pathname: string): boolean {
  return matchesRoute(pathname, publicRoutes);
}

/**
 * Check if path is an auth route
 */
function isAuthRoute(pathname: string): boolean {
  return matchesRoute(pathname, authRoutes);
}

/**
 * Check if path is a protected route
 */
function isProtectedRoute(pathname: string): boolean {
  return matchesRoute(pathname, protectedRoutes);
}

/**
 * Check if path is an admin route
 */
function isAdminRoute(pathname: string): boolean {
  return matchesRoute(pathname, adminRoutes);
}

/**
 * Check if path is an API auth route
 */
function isApiAuthRoute(pathname: string): boolean {
  return pathname.startsWith(apiAuthPrefix);
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(
  response: NextResponse,
  pathname: string,
): NextResponse {
  // Common security headers for all routes
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Strict CSP for admin and auth routes
  if (isAdminRoute(pathname) || isAuthRoute(pathname)) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=()",
    );
  }

  // SEO headers for sensitive pages
  if (isAdminRoute(pathname)) {
    response.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive, nocache",
    );
  } else if (isAuthRoute(pathname)) {
    // Allow following links but don't index auth pages
    response.headers.set("X-Robots-Tag", "noindex, noarchive");
  } else if (isProtectedRoute(pathname)) {
    // Don't index protected user pages
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

// ========================================
// Middleware
// ========================================

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // 1. Always allow API auth routes
  if (isApiAuthRoute(pathname)) {
    return NextResponse.next();
  }

  // 2. Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") // Files with extensions (images, etc.)
  ) {
    return NextResponse.next();
  }

  // 3. Handle auth routes (login, register, etc.)
  if (isAuthRoute(pathname)) {
    // Redirect logged-in users away from auth pages
    if (isLoggedIn) {
      const response = NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, nextUrl),
      );
      return addSecurityHeaders(response, pathname);
    }
    const response = NextResponse.next();
    return addSecurityHeaders(response, pathname);
  }

  // 4. Handle admin routes
  if (isAdminRoute(pathname)) {
    // Not logged in -> redirect to login
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname + nextUrl.search);
      const response = NextResponse.redirect(
        new URL(`${ADMIN_LOGIN_PATH}?callbackUrl=${callbackUrl}`, nextUrl),
      );
      return addSecurityHeaders(response, pathname);
    }

    // Logged in but not admin -> redirect to home
    if (userRole !== "ADMIN") {
      const response = NextResponse.redirect(
        new URL(UNAUTHORIZED_PATH, nextUrl),
      );
      return addSecurityHeaders(response, pathname);
    }

    const response = NextResponse.next();
    return addSecurityHeaders(response, pathname);
  }

  // 5. Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname + nextUrl.search);
      const response = NextResponse.redirect(
        new URL(`${LOGIN_PATH}?callbackUrl=${callbackUrl}`, nextUrl),
      );
      return addSecurityHeaders(response, pathname);
    }
    const response = NextResponse.next();
    return addSecurityHeaders(response, pathname);
  }

  // 6. Allow public routes and everything else
  const response = NextResponse.next();
  return addSecurityHeaders(response, pathname);
});

// ========================================
// Matcher Configuration
// ========================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
