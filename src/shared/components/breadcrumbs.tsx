"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
  homeHref?: string;
}

export function Breadcrumbs({
  items,
  showHome = true,
  className,
  homeHref = "/admin",
}: BreadcrumbsProps) {
  const pathname = usePathname();

  // If items are not provided, try to generate them from the current path
  const breadcrumbs = items || generateBreadcrumbs(pathname);

  return (
    <nav aria-label="Breadcrumb" className={cn("flex py-5 section", className)}>
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {showHome && (
          <li className="flex items-center">
            <Link
              href={homeHref}
              className="flex items-center hover:text-foreground transition-colors"
              title="Dashboard"
            >
              <Home className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        )}

        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isFirstAndHomeHidden = index === 0 && !showHome;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {(!isFirstAndHomeHidden || showHome) && (
                <ChevronRight className="w-4 h-4 mx-1 shrink-0 text-muted-foreground/40" />
              )}

              {item.href && !isLast && !item.active ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors capitalize truncate max-w-50"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "capitalize truncate max-w-50",
                    (isLast || item.active) && "text-foreground font-medium",
                  )}
                  aria-current={isLast || item.active ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Helper to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Remove trailing slash and split
  const asPathWithoutQuery = pathname.split("?")[0];
  const segments = asPathWithoutQuery.split("/").filter(Boolean);

  // Filter out "admin" if it's the root for smoother display (optional)
  const relevantSegments = segments.filter((segment) => segment !== "admin");

  return relevantSegments.map((segment) => {
    // Reconstruct path: find where this segment is in the original segments to build correct href
    const originalIndex = segments.indexOf(segment);
    const href = "/" + segments.slice(0, originalIndex + 1).join("/");

    return {
      label: segment.replace(/-/g, " "),
      href,
    };
  });
}

export default Breadcrumbs;



/*
import { Breadcrumbs } from "@/shared/components/breadcrumbs";

// Auto-generated
<Breadcrumbs />

// Or custom
<Breadcrumbs items={[
  { label: "Products", href: "/admin/products" },
  { label: "Add New", active: true }
]} />

*/