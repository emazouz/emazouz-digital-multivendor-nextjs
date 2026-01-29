"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search, Home, ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl mx-auto text-center space-y-8">
        {/* Animated Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full h-64 md:h-80 flex items-center justify-center mb-8"
        >
          {/* Abstract geometric shapes or illustration representing empty state */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
            />

            <div className="text-[10rem] md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 leading-none select-none">
              404
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-medium text-foreground/20 dark:text-foreground/20 rotate-12">
              Page Not Found
            </div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-md"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Oops! We couldn&rsquo;t find that page.
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            The page you&rsquo;re looking for might have been removed, had its
            name changed, or is temporarily unavailable.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-md mx-auto w-full relative"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products, themes..."
              className="pl-10 h-11 rounded-full border-border/50 bg-background shadow-sm focus-visible:ring-purple-500"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1 bottom-1 rounded-full bg-purple-600 hover:bg-purple-700 text-white px-4"
            >
              Search
            </Button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 bg-foreground text-background hover:bg-foreground/90"
          >
            <Link href="/products">Browse Products</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 border-border hover:bg-muted"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Homepage
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="lg"
            className="rounded-full px-8 hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <Link href="/contact">Contact Support</Link>
          </Button>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="pt-12 flex items-center justify-center space-x-6 text-sm text-muted-foreground"
        >
          <button className="flex items-center hover:text-purple-600 transition-colors">
            <AlertCircle className="mr-2 h-4 w-4" />
            Report broken link
          </button>
          <span className="text-border">|</span>
          <button className="flex items-center hover:text-purple-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Go back</span>
          </button>
        </motion.div>

        {/* Debug/URL info (Subtle) */}
        <div className="mt-8 text-xs text-muted-foreground/30 font-mono">
          Error Code: 404
        </div>
      </div>
    </div>
  );
}
