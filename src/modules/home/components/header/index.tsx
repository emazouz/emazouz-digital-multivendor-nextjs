"use client";

import React from "react";
import Link from "next/link";
import {
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

function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  console.log("user: ", user);

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
            {/* Shop Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative w-12 h-12 rounded-full"
              aria-label="Shopping Cart"
            >
              <ShoppingCartIcon className="size-5" />
              <Badge
                variant="default"
                className="absolute top-1.5 right-1.5 h-4 w-4 p-0 flex items-center justify-center text-xs"
              >
                0
              </Badge>
            </Button>

            {/* Following/Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hidden sm:flex w-12 h-12 rounded-full"
              aria-label="Wishlist"
            >
              <Heart className="size-5" />
              <Badge
                variant="default"
                className="absolute top-1.5 right-1.5 h-4 w-4 p-0 flex items-center justify-center text-xs"
              >
                2
              </Badge>
            </Button>

            <ModeToggle />
          </div>

          {/* User Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    {user.image && <AvatarImage src={user.image} />}
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {user.image && <AvatarImage src={user.image} />}
                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{user.name}</p>
                      <p>{user.email}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Orders</DropdownMenuItem>
                <DropdownMenuItem>Purchases</DropdownMenuItem>
                <DropdownMenuItem>Subscriptions</DropdownMenuItem>
                <DropdownMenuItem>Downloads</DropdownMenuItem>
                <DropdownMenuItem>
                  {user.role === "ADMIN" ? "Dashboard" : "Profile"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
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
          ) : (
            <Button
              size="sm"
              className="hidden sm:flex items-center gap-2 rounded-full"
              asChild
            >
              <Link href="/login">
                <UserIcon className="w-4 h-4" />
                <span>Create Account</span>
              </Link>
            </Button>
          )}

          {/* Mobile Menu Toggle (Placeholder for now) */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
