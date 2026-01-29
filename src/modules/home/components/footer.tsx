import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Send,
  Heart,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border mt-20">
      <div className="wrapper">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-border/50">
          <div className="relative rounded-3xl bg-primary/5 px-6 py-10 md:px-12 md:py-16 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[200px] h-[200px] bg-secondary/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="max-w-xl space-y-3">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Stay in the loop
                </h3>
                <p className="text-muted-foreground text-base md:text-lg">
                  Join our newsletter to get top news before anyone else.
                </p>
              </div>

              <div className="w-full max-w-md flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 bg-background border-border"
                />
                <Button size="lg" className="h-12 px-8 font-semibold">
                  Subscribe
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 space-md">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Emazouz Digital
              </h2>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Your premium destination for high-quality digital assets. We help
              creators build stunning projects faster.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Youtube className="w-5 h-5" />} />
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-md">
            <h4 className="font-bold text-foreground">Marketplace</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <FooterLink href="#">All Products</FooterLink>
              </li>
              <li>
                <FooterLink href="#">New Arrivals</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Featured</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Daily Deals</FooterLink>
              </li>
            </ul>
          </div>

          <div className="space-md">
            <h4 className="font-bold text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <FooterLink href="#">About Us</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Careers</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Blog</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Contact</FooterLink>
              </li>
            </ul>
          </div>

          <div className="space-md">
            <h4 className="font-bold text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <FooterLink href="#">Privacy Policy</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Terms of Service</FooterLink>
              </li>
              <li>
                <FooterLink href="#">License</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Refund Policy</FooterLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2024 Emazouz Digital. All rights reserved.</p>
          <div className="flex items-center gap-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
            <span>for creators.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
    >
      {icon}
    </Link>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="hover:text-primary transition-colors duration-200 block"
    >
      {children}
    </Link>
  );
}
