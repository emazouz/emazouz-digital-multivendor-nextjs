// src/app/admin/products/page.tsx

import { Suspense } from "react";
import type { Metadata } from "next";
import AdminProductsList from "@/modules/admin/components/admin-products-list";
import { Skeleton } from "@/shared/components/ui/skeleton";

// Metadata for admin page
export const metadata: Metadata = {
  title: "Products Management - Admin Dashboard | Emazouz Digital",
  description:
    "Manage your products, inventory, and pricing in the Emazouz Digital admin dashboard.",
  robots: {
    index: false, // Prevent indexing admin pages
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

function ProductsPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      {/* Filters Skeleton */}
      <Skeleton className="h-16 rounded-xl" />

      {/* Table Skeleton */}
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="section">
      <Suspense fallback={<ProductsPageSkeleton />}>
        <AdminProductsList />
      </Suspense>
    </div>
  );
}
