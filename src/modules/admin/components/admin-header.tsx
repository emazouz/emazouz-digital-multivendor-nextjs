"use client";

import { memo, useCallback, useMemo } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Badge } from "@/shared/components/ui/badge";
import { ModeToggle } from "@/modules/home/components/header/mode-toggle";
import Logo from "@/shared/components/logo";
import { useSidebar } from "../context/sidebar-context";
import {
  Search,
  Bell,
  LayoutGrid,
  Settings,
  ChevronDown,
  User,
  LogOut,
  Menu,
} from "lucide-react";

// Separate UserProfile component for better optimization
const UserProfile = memo(function UserProfile() {
  const { data: session } = useSession();
  const user = session?.user;

  const userInitials = useMemo(() => {
    return user?.name?.slice(0, 2).toUpperCase() || "U";
  }, [user?.name]);

  const firstName = useMemo(() => {
    return user?.name?.split(" ")[0] || "User";
  }, [user?.name]);

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 gap-2 px-2 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.image || "/avatar.png"} alt={user.name || "User"} />
            <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden lg:inline-block text-sm font-medium">
            {firstName}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin/profile" className="cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/settings" className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

function AdminHeader() {
  const { toggleSidebar } = useSidebar();

  // TODO: Replace with actual notification count from API/State
  const notificationCount = 0;

  const handleNotificationClick = useCallback(() => {
    // TODO: Navigate to notifications page or open notifications panel
    console.log("Open notifications");
  }, []);

  const handleAppsClick = useCallback(() => {
    // TODO: Open apps menu
    console.log("Open apps menu");
  }, []);

  const handleSettingsClick = useCallback(() => {
    // TODO: Navigate to settings or open quick settings
    console.log("Open settings");
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="h-16 flex items-center justify-between px-4">
        {/* Left Section - Logo & Menu */}
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link href="/admin" className="shrink-0">
            <Logo />
          </Link>

          {/* Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-10 w-10 rounded-full"
            aria-label="Toggle sidebar"
          >
            <Menu className="size-5" />
          </Button>

          {/* Search Bar */}
          <div className="hidden md:flex relative ml-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products, orders..."
              className="w-64 lg:w-96 h-10 pl-10 rounded-full border-input"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Right Section - Icons & Profile */}
        <div className="flex items-center gap-1 lg:gap-2">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative w-10 h-10 rounded-full"
            onClick={handleNotificationClick}
            aria-label={
              notificationCount > 0
                ? `Notifications (${notificationCount} unread)`
                : "Notifications"
            }
          >
            <Bell className="size-5" />
            {notificationCount > 0 && (
              <Badge
                variant="default"
                className="absolute top-1 right-1 h-5 w-5 p-0 flex items-center justify-center text-xs pointer-events-none"
              >
                {notificationCount > 99 ? "99+" : notificationCount}
              </Badge>
            )}
          </Button>

          {/* Apps Grid */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={handleAppsClick}
            aria-label="Apps"
          >
            <LayoutGrid className="size-5" />
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={handleSettingsClick}
            aria-label="Settings"
          >
            <Settings className="size-5" />
          </Button>

          {/* Dark Mode Toggle */}
          <div className="[&_button]:h-9 [&_button]:w-9">
            <ModeToggle />
          </div>

          {/* User Profile Dropdown */}
          <UserProfile />
        </div>
      </div>
    </header>
  );
}

export default memo(AdminHeader);
