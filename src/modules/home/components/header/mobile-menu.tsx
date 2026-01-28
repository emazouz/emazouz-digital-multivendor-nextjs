import { memo } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import {
  MenuIcon,
  ChevronRight,
  Facebook,
  Linkedin,
  Github,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/shared/components/ui/separator";
import Logo from "@/shared/components/logo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/digital-products", label: "Digital Products" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const PAGES_MENU = [
  { href: "/follow-us", label: "Follow Us" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cart", label: "Shopping Cart" },
];

const SOCIAL_LINKS = [
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
];

const MobileMenu = memo(function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="text-xl font-bold">
            <Logo />
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-4 px-4">
          {/* Main Navigation */}
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <SheetClose key={link.href} asChild>
                <Link
                  href={link.href}
                  className="flex items-center justify-between py-2 text-base font-medium transition-colors hover:text-primary"
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </SheetClose>
            ))}
          </div>

          <Separator />

          {/* Pages Menu */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">
              Pages
            </h3>
            {PAGES_MENU.map((page) => (
              <SheetClose key={page.href} asChild>
                <Link
                  href={page.href}
                  className="flex items-center justify-between py-2 text-sm transition-colors hover:text-primary"
                >
                  {page.label}
                </Link>
              </SheetClose>
            ))}
          </div>

          <Separator />

          {/* Social Media Links */}
          <div className="flex items-center justify-center gap-4 py-2">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>
          <Separator />

          {/* User Actions */}
          <div className="flex flex-col gap-2 mt-2">
            <SheetClose asChild>
              <Button asChild className="w-full rounded-full">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="outline" asChild className="w-full rounded-full">
                <Link href="/auth/register">Create Account</Link>
              </Button>
            </SheetClose>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
});

export default MobileMenu;
