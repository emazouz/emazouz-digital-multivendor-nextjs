// src/app/auth/reset-password/page.tsx

import ResetPasswordForm from "@/modules/auth/components/reset-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Emazouz Digital",
  description: "Create a new password for your Emazouz Digital account.",
  robots: {
    index: false,
    follow: true,
    noarchive: true,
  },
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}