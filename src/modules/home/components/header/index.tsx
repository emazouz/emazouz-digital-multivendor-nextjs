"use client";

import { memo, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  BellIcon,
  ChevronDownIcon,
  Heart,
  LogOutIcon,
  ShoppingCartIcon,
  UserIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import Logo from "@/shared/components/logo";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import MobileMenu from "./mobile-menu";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/digital-products", label: "Digital Products" },
  { href: "/blog", label: "Blog" },
];

const PAGES_MENU = [
  { href: "/follow-us", label: "Follow Us" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cart", label: "Shopping Cart" },
];

const UserMenu = memo(function UserMenu() {
  const { data: session } = useSession();
  const user = session?.user;

  const userInitial = useMemo(() => {
    return user?.name?.charAt(0).toUpperCase() || "U";
  }, [user?.name]);

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  if (!user) {
    return (
      <Button
        size="sm"
        className="hidden sm:flex items-center gap-2 rounded-full"
        asChild
      >
        <Link href="/auth/login">
          <UserIcon className="w-4 h-4" />
          <span>Create Account</span>
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders">Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/purchases">Purchases</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/subscriptions">Subscriptions</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/downloads">Downloads</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={user.role === "ADMIN" ? "/admin" : "/profile"}>
            {user.role === "ADMIN" ? "Dashboard" : "Profile"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="w-4 h-4 mr-2" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

const Header = memo(function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/60">
      <div className="wrapper flex h-17.5 items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {link.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground/60 focus:outline-none">
              Pages
              <ChevronDownIcon className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {PAGES_MENU.map((page) => (
                <DropdownMenuItem key={page.href} asChild>
                  <Link href={page.href}>{page.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/contact"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Contact
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Notification */}
            <Button
              variant="ghost"
              size="icon"
              className="relative w-12 h-12 rounded-full"
              aria-label="Notifications"
              asChild
            >
              <Link href="/notifications">
                <BellIcon className="size-5" />
                <Badge
                  variant="default"
                  className="absolute top-1.5 right-1.5 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  0
                </Badge>
              </Link>
            </Button>

            {/* Shop Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative w-12 h-12 rounded-full"
              aria-label="Shopping cart"
              asChild
            >
              <Link href="/cart">
                <ShoppingCartIcon className="size-5" />
                <Badge
                  variant="default"
                  className="absolute top-1.5 right-1.5 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  0
                </Badge>
              </Link>
            </Button>

            {/* Following/Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hidden sm:flex w-12 h-12 rounded-full"
              aria-label="Wishlist"
              asChild
            >
              <Link href="/wishlist">
                <Heart className="size-5" />
                <Badge
                  variant="default"
                  className="absolute top-1.5 right-1.5 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  0
                </Badge>
              </Link>
            </Button>

            <ModeToggle />
          </div>

          {/* User Auth */}
          <UserMenu />

          {/* Mobile Menu Toggle */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
});

export default Header;
