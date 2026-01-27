"use client";

import Link from "next/link";
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
  BellIcon,
  LogOutIcon,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { signOut, useSession } from "next-auth/react";

function AdminHeader() {
  const { toggleSidebar } = useSidebar();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      {/* Top Bar */}
      <div className="h-16 flex-between px-4">
        {/* Left Section - Logo & Menu */}
        <div className="flex items-center gap-2">
          {/* Menu Toggle Button */}
        

          <Link href="/admin">
            <Logo />
          </Link>


          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-12 w-12 rounded-full rotate-18"
          >
            <Menu className="size-5" />
          </Button>
        

          {/* Logo */}

          {/* Search Bar */}
          <div className="hidden md:flex relative ml-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/60" />
            <Input
              type="search"
              placeholder="Search something..."
              className="w-64 lg:w-96 h-10 pl-10 rounded-full focus:outline-none focus:ring-0 focus:border-none border-none outline-none"
            />
          </div>
        </div>

        {/* Right Section - Icons & Profile */}
        <div className="flex items-center gap-1 lg:gap-2">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative w-12 h-12 rounded-full"
            aria-label="Notification"
          >
            <BellIcon className="size-5" />
            <Badge
              variant="default"
              className="absolute top-1.5 right-1.5 h-4 w-4 p-0 flex items-center justify-center text-xs"
            >
              9
            </Badge>
          </Button>

          {/* Apps Grid */}
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full"
          >
            <LayoutGrid className="size-5" />
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full"
          >
            <Settings className="size-5" />
          </Button>

          {/* Dark Mode Toggle */}
          <div className="[&_button]:h-9 [&_button]:w-9 [&_button]:text-primary-foreground [&_button:hover]:bg-primary-foreground/10 [&_button:hover]:text-primary-foreground">
            <ModeToggle />
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 gap-2 px-2 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.image || "/avatar.png"} alt="User" />
                  <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xs">
                    {user?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline-block text-sm font-medium">
                  {user?.name?.split(" ")[0]}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
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
              <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                <Button
                  variant={"destructive"}
                  size="sm"
                  className="w-full"
                  onClick={() => signOut()}
                >
                  <LogOutIcon className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
