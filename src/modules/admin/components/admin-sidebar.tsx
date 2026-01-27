"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { useSidebar } from "../context/sidebar-context";
import {
  LayoutDashboard,
  User,
  Users,
  Settings,
  FileText,
  DollarSign,
  MessageSquare,
  Download,
  LogOut,
  Package,
  ShoppingCart,
  Bell,
  Ticket,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  section?: string;
}

const navItems: NavItem[] = [
  // ====== الرئيسية ======
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="w-5 h-5" />,
    section: "main",
  },

  // ====== إدارة المتجر ======
  {
    label: "Products",
    href: "/admin/products",
    icon: <Package className="w-5 h-5" />,
    section: "store",
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: <ShoppingCart className="w-5 h-5" />,
    section: "store",
  },
  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: <Ticket className="w-5 h-5" />,
    section: "store",
  },

  // ====== المستخدمين والتفاعل ======
  {
    label: "Users",
    href: "/admin/users",
    icon: <Users className="w-5 h-5" />,
    section: "users",
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: <MessageSquare className="w-5 h-5" />,
    section: "users",
  },

  // ====== التقارير والمالية ======
  {
    label: "Downloads",
    href: "/admin/downloads",
    icon: <Download className="w-5 h-5" />,
    section: "reports",
  },
  {
    label: "Earnings",
    href: "/admin/earnings",
    icon: <DollarSign className="w-5 h-5" />,
    section: "reports",
  },
  {
    label: "Statements",
    href: "/admin/statements",
    icon: <FileText className="w-5 h-5" />,
    section: "reports",
  },

  // ====== الحساب والإعدادات ======
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: <Bell className="w-5 h-5" />,
    section: "account",
  },
  {
    label: "Profile",
    href: "/admin/profile",
    icon: <User className="w-5 h-5" />,
    section: "account",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
    section: "account",
  },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logout clicked");
  };

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] bg-background border-r border-border flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-18" : "w-64",
      )}
    >
      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full h-11 transition-all duration-200",
                      isCollapsed
                        ? "justify-center px-2"
                        : "justify-start gap-3 px-4",
                      isActive
                        ? "bg-primary/10 text-primary hover:bg-primary/15"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span
                      className={cn(
                        "transition-colors shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="text-base font-medium truncate">
                        {item.label}
                      </span>
                    )}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full h-11 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
            isCollapsed ? "justify-center px-2" : "justify-start gap-3 px-4",
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && (
            <span className="text-base font-medium">Logout</span>
          )}
        </Button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
