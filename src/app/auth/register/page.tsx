// src/app/auth/register/page.tsx

import type { Metadata } from "next";
import RegisterForm from "@/modules/auth/components/register-form";

export const metadata: Metadata = {
  title: "Create Account - Emazouz Digital",
  description: "Create your Emazouz Digital account to access our services and start your digital transformation journey.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Create Account - Emazouz Digital",
    description: "Create your account and get started with Emazouz Digital.",
    url: "/auth/register",
  },
};

export default function RegisterPage() {
  return <RegisterForm />;
}