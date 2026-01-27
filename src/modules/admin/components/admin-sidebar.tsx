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
  UserCheck,
  Settings,
  FileText,
  DollarSign,
  MessageSquare,
  Download,
  RefreshCcw,
  LogOut,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Profile",
    href: "/admin/profile",
    icon: <User className="w-5 h-5" />,
  },
  {
    label: "Followers",
    href: "/admin/followers",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Followings",
    href: "/admin/followings",
    icon: <UserCheck className="w-5 h-5" />,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    label: "Statements",
    href: "/admin/statements",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Earnings",
    href: "/admin/earnings",
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    label: "Downloads",
    href: "/admin/downloads",
    icon: <Download className="w-5 h-5" />,
  },
  {
    label: "Refunds",
    href: "/admin/refunds",
    icon: <RefreshCcw className="w-5 h-5" />,
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
