import ResetForm from "@/modules/auth/components/reset-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

const ResetPage = () => {
  return <ResetForm />;
};

export default ResetPage;
