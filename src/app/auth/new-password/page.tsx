// src/app/auth/new-password/page.tsx

import NewPasswordForm from "@/modules/auth/components/new-password-form";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/shared/components/ui/loader";

export const metadata: Metadata = {
  title: "Forgot Password - Emazouz Digital",
  description: "Reset your Emazouz Digital account password securely.",
  robots: {
    index: false,
    follow: true,
  },
};

const NewPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      }
    >
      <NewPasswordForm />
    </Suspense>
  );
};

export default NewPasswordPage;
