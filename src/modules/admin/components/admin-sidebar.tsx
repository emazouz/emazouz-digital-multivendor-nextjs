"use client";

import { memo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { useSidebar } from "../context/sidebar-context";
import { LogOut } from "lucide-react";
import { NAV_ITEMS } from "@/shared/constants/nav-items";
import { NavItem } from "@/shared/types";

// Group items by section
const groupedNavItems = NAV_ITEMS.reduce(
  (acc, item) => {
    const section = item.section || "other";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  },
  {} as Record<string, NavItem[]>,
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
    [pathname],
  );

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] sticky bottom-0 bg-background border-r border-border flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-18" : "w-64",
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

export default memo(AdminSidebar);
