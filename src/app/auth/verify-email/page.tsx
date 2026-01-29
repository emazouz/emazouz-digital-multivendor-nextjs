// src/app/auth/verify-email/page.tsx

import { Suspense } from "react";
import VerifyEmailForm from "@/modules/auth/components/verify-email-form";
import { Loader } from "@/shared/components/ui/loader";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email - Emazouz Digital",
  description:
    "Verify your email address to activate your Emazouz Digital account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader size="lg" />
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
