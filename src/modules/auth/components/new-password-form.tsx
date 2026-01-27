"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Variants, motion } from "motion/react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import Logo from "@/shared/components/logo";
import { ModeToggle } from "@/modules/home/components/header/mode-toggle";
import { Eye, EyeClosed, AlertCircle } from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { Loader } from "@/shared/components/ui/loader";
import LeftSideAuth from "./left-side";
import { newPassword } from "../actions/auth.actions";

const NewPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!token) {
      setError("Missing token!");
      return;
    }

    try {
      const result = await newPassword({ password }, token);

      if (result.success) {
        setSuccess(result.success);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError(result.error || "An error occurred.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Login Form */}
      <LeftSideAuth />

      {/* Right Side - Decorative Images */}
      <div className="relative flex items-center justify-center p-6 sm:p-8 md:p-12 bg-background order-2 lg:order-1">
        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:right-auto lg:left-6"
        >
          <ModeToggle />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-md mx-auto"
        >
          {/* Logo */}
          <motion.div variants={itemVariants}>
            <Logo />
          </motion.div>

          {/* Welcome Text */}
          <motion.h4
            variants={itemVariants}
            className="text-3xl sm:text-5xl font-bold text-foreground mb-8"
          >
            Reset Password
          </motion.h4>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6 flex items-start gap-3"
            >
              <div className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0">
                ✓
              </div>
              <p className="text-sm text-emerald-500">{success}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label
                htmlFor="password"
                className="block text-base font-semibold text-foreground"
              >
                New Password
              </Label>
              <div className="relative group">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6+ characters"
                  className="h-12 sm:h-14 pl-4 pr-12 bg-muted/50 border-input rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/20 transition-all duration-300 focus:shadow-lg focus:shadow-primary/10"
                  required
                  minLength={6}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeClosed className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3 pt-4">
              {/* Reset Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full h-12 disabled:opacity-70 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader size="sm" />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </motion.div>

            {/* Back to Login Link */}
            <motion.div variants={itemVariants} className="text-center pt-4">
              <Link
                href="/auth/login"
                className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium transition-colors"
                tabIndex={isLoading ? -1 : 0}
              >
                Back to Login
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewPasswordForm;
