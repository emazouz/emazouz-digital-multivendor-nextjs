import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default async function DashboardAdmin() {
  return (
    <main className="flex items-center justify-center min-h-screen w-full flex-col gap-16"></main>
  );
}
