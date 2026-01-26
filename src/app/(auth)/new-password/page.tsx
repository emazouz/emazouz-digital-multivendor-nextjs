import NewPasswordForm from "@/modules/auth/components/new-password-form";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/shared/components/ui/loader";

export const metadata: Metadata = {
  title: "New Password",
  description: "Set your new password",
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
