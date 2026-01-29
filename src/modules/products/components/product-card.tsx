"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { ProductDTO } from "@/shared/types";
import {
  Star,
  ExternalLink,
  Heart,
  Eye,
  ShoppingCart,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Image from "next/image";
import { useState } from "react";

interface ProductCardProps {
  product: ProductDTO;
}

function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountPercentage =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="group relative bg-gradient-to-br from-card via-card to-card/80 rounded-2xl border border-border/50 overflow-hidden shadow-lg shadow-primary/5 transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/2] overflow-hidden">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
            <Sparkles className="w-12 h-12 opacity-30" />
          </div>
        )}

        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-2 right-2 z-20"
        >
          <span className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-xl px-3 py-1.5 rounded-full text-xs font-semibold text-foreground shadow-lg border border-white/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {product.category}
          </span>
        </motion.div>

        {/* Badges Container */}
        <div className="absolute top-2 left-2 flex flex-col gap-sm z-20">
          {product.isHighResolution && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-purple-500/30"
            >
              <Zap className="w-3 h-3" />
              HD Quality
            </motion.span>
          )}
          {discountPercentage > 0 && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-rose-500/30 animate-pulse"
            >
              <Sparkles className="w-3 h-3" />
              {discountPercentage}% OFF
            </motion.span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 p-2 flex justify-end gap-sm">
          <Link href={`/products/${product.slug}`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-card backdrop-blur-xl flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-300 shadow-lg cursor-pointer"
            >
              <Eye className="w-5 h-5" />
            </motion.div>
          </Link>
          <Link href={`/products/${product.slug}`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-card backdrop-blur-xl flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-300 shadow-lg cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.div>
          </Link>
          {/* Wishlist Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`w-10 h-10 rounded-full bg-card backdrop-blur-xl flex items-center justify-center transition-colors duration-300 shadow-lg cursor-pointer ${
              isWishlisted
                ? "bg-rose-500 text-white shadow-rose-500/30"
                : "bg-white/90 dark:bg-black/80 text-foreground hover:bg-rose-500 hover:text-white"
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${isWishlisted ? "fill-current" : ""}`}
            />
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-sm">
        {/* Title & Rating Row */}
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/products/${product.slug}`}
            className="group/title flex-1"
          >
            <h3 className="font-bold text-lg leading-tight text-foreground group-hover/title:text-primary transition-colors duration-300 line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center justify-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full shrink-0">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
              {product.averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {product.shortDescription}
        </p>

        {/* Framework Tag */}
        {product.framework && (
          <div className="flex justify-start items-center gap-sm">
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {product.framework}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Price & CTA Section */}
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium caveat-brush-regular">
              {product.salesCount.toLocaleString()} Sales
            </p>
            <div className="flex items-baseline gap-sm">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent caveat-brush-regular">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <Link href={`/products/${product.slug}`}>
            <Button
              size="sm"
              className="group/btn relative overflow-hidden bg-gradient-to-r from-secondary to-primary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground rounded-full px-5 py-2 font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-sm">
                <ExternalLink className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                Live Preview
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
