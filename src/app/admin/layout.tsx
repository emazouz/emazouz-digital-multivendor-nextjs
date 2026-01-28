import { Metadata } from "next";
import AdminSidebar from "@/modules/admin/components/admin-sidebar";
import AdminHeader from "@/modules/admin/components/admin-header";
import { SidebarProvider } from "@/modules/admin/context/sidebar-context";
import Breadcrumbs from "@/shared/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-muted/30">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6 overflow-auto">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
