"use client";

import { memo, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
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
  section: string;
}

// Move navItems outside component to prevent re-creation on every render
const navItems: NavItem[] = [
  // Main Section
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="w-5 h-5" />,
    section: "main",
  },

  // Store Management
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

  // Users & Interaction
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

  // Reports & Finance
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

  // Account & Settings
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

// Group items by section
const groupedNavItems = navItems.reduce(
  (acc, item) => {
    const section = item.section || "other";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  },
  {} as Record<string, NavItem[]>
);

const sectionOrder = ["main", "store", "users", "reports", "account"];
const sectionLabels: Record<string, string> = {
  main: "Main",
  store: "Store Management",
  users: "Users & Interaction",
  reports: "Reports & Finance",
  account: "Account",
};

// Memoized NavLink component
const NavLink = memo(function NavLink({
  item,
  isActive,
  isCollapsed,
}: {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}) {
  return (
    <Link href={item.href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full h-11 transition-all duration-200",
          isCollapsed ? "justify-center px-2" : "justify-start gap-3 px-4",
          isActive
            ? "bg-primary/10 text-primary hover:bg-primary/15"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
        title={isCollapsed ? item.label : undefined}
      >
        <span
          className={cn(
            "transition-colors shrink-0",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        >
          {item.icon}
        </span>
        {!isCollapsed && (
          <span className="text-base font-medium truncate">{item.label}</span>
        )}
      </Button>
    </Link>
  );
});

function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  // Memoize active state checker
  const isItemActive = useCallback(
    (href: string) => {
      if (pathname === href) return true;
      if (href !== "/admin" && pathname.startsWith(href)) return true;
      return false;
    },
    [pathname]
  );

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] sticky bottom-0 bg-background border-r border-border flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-18" : "w-64"
      )}
    >
      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <ul className="space-y-6">
          {sectionOrder.map((sectionKey) => {
            const items = groupedNavItems[sectionKey];
            if (!items) return null;

            return (
              <li key={sectionKey}>
                {/* Section Label */}
                {!isCollapsed && sectionKey !== "main" && (
                  <>
                    <Separator className="my-2" />
                    <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {sectionLabels[sectionKey]}
                    </p>
                  </>
                )}

                {/* Section Items */}
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.href}>
                      <NavLink
                        item={item}
                        isActive={isItemActive(item.href)}
                        isCollapsed={isCollapsed}
                      />
                    </li>
                  ))}
                </ul>
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
            isCollapsed ? "justify-center px-2" : "justify-start gap-3 px-4"
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

export default memo(AdminSidebar);
