"use client";

import { memo, useCallback, useEffect, useState } from "react";
import ProductCard from "@/modules/products/components/product-card";
import { Button } from "@/shared/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { ProductCategory } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import CategoryList from "@/modules/products/components/category-list";
import { ProductDTO } from "@/shared/types";
import {
  fetchProductsAction,
  fetchProductsByCategoryAction,
} from "@/modules/products/actions";

const ArrivalProducts = memo(function ArrivalProducts() {
  const searchParams = useSearchParams();
  const [featuredProducts, setFeaturedProducts] = useState<ProductDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryParam = searchParams.get("category");
  const category: ProductCategory | "All" =
    categoryParam && categoryParam !== "All"
      ? (categoryParam as ProductCategory)
      : "All";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const products =
          category !== "All"
            ? await fetchProductsByCategoryAction(category as ProductCategory)
            : await fetchProductsAction();

        setFeaturedProducts(products);
      } catch (e) {
        setError(
          category !== "All"
            ? "Failed to load products for this category."
            : "Failed to load featured products.",
        );
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="w-full bg-muted py-8 space-y-10">
      <div className="wrapper">
        <div className="flex items-center justify-between">
          <h2 className="bold-h1 caveat-brush-regular">New Arrival Products</h2>
          <Link href="/products" className="text-primary">
            <Button variant={"outline"} className="px-4 rounded-full">
              <span>View All Products</span>
              <ExternalLink />
            </Button>
          </Link>
        </div>

        <div className="w-full py-6">
          <CategoryList />
        </div>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[250px] w-full rounded-xl" />
                <div className="space-sm">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={product.id}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No products found in this category.
            </div>
          )}
        </motion.div>
        {error && (
          <div className="col-span-full text-center py-4 text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
});

export default ArrivalProducts;
