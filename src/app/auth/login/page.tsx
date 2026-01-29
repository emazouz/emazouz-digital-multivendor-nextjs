// src/app/auth/login/page.tsx

import type { Metadata } from "next";
import LoginForm from "@/modules/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login - Emazouz Digital",
  description: "Sign in to your Emazouz Digital account to access your dashboard and manage your services.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Login - Emazouz Digital",
    description: "Sign in to your Emazouz Digital account.",
    url: "/auth/login",
  },
};

export default function LoginPage() {
  return <LoginForm />;
}