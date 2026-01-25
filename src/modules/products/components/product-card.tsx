"use client";
import { motion } from "motion/react";
import React from "react";
import Link from "next/link";
import { ProductDTO } from "@/shared/types";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ProductCardProps {
  product: ProductDTO;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {product.thumbnailUrl ? (
          <img
            src={product.thumbnailUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
          {product.category}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <Link
            href={`/products/${product.slug}`}
            className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1"
          >
            {product.title}
          </Link>
          <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
            <Star className="w-4 h-4 fill-current" />
            <span>{product.averageRating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 min-h-[2.5rem]">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="font-bold text-xl text-primary">
            {product.currency} {product.price.toFixed(2)}
          </div>
          <Button size="sm" variant="secondary" className="rounded-full">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
