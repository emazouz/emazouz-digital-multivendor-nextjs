import { Suspense } from "react";
import VerifyEmailForm from "@/modules/auth/components/verify-email-form";
import { Loader } from "@/shared/components/ui/loader";

export const metadata = {
  title: "Verify Email | Emazouz Digital",
  description: "Verify your email address to complete registration",
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
