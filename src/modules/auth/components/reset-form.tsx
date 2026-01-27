"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Variants, motion } from "motion/react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import Logo from "@/shared/components/logo";
import { ModeToggle } from "@/modules/home/components/header/mode-toggle";
import { Mail, AlertCircle, RefreshCw } from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { Loader } from "@/shared/components/ui/loader";
import LeftSideAuth from "./left-side";
import { reset } from "../actions/auth.actions";

// Cooldown intervals in seconds: 1 min, 3 min, 5 min
const COOLDOWN_INTERVALS = [60, 180, 300];

const ResetForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCount, setResendCount] = useState(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get current cooldown interval based on resend count
  const getCurrentCooldown = useCallback(() => {
    const index = Math.min(resendCount, COOLDOWN_INTERVALS.length - 1);
    return COOLDOWN_INTERVALS[index];
  }, [resendCount]);

  // Countdown timer effect
  useEffect(() => {
    if (cooldownSeconds <= 0) {
      if (success) setCanResend(true);
      return;
    }

    setCanResend(false);
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSeconds, success]);

  // Start cooldown after successful email send
  const startCooldown = useCallback(() => {
    const cooldown = getCurrentCooldown();
    setCooldownSeconds(cooldown);
    setCanResend(false);
  }, [getCurrentCooldown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await reset({ email });

      if (result.success) {
        setSuccess(result.success);
        startCooldown();
      } else {
        setError(result.error || "An error occurred.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await reset({ email });

      if (result.success) {
        setSuccess(result.success);
        setResendCount((prev) => prev + 1);
        startCooldown();
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
      <div className="relative flex-center p-6 sm:p-8 md:p-12 bg-background order-2 lg:order-1">
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
            Forgot Password
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

          {/* Success Message with Resend Option */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0">
                  ✓
                </div>
                <p className="text-sm text-emerald-500">{success}</p>
              </div>

              {/* Resend Section */}
              <div className="mt-4 pt-3 border-t border-emerald-500/20">
                {cooldownSeconds > 0 ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCw className="w-4 h-4" />
                    <span>
                      Resend available in{" "}
                      <span className="font-semibold text-foreground">
                        {formatTime(cooldownSeconds)}
                      </span>
                    </span>
                  </div>
                ) : canResend ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-primary hover:text-primary/80 hover:bg-primary/10 -ml-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader size="sm" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Resend reset email
                      </span>
                    )}
                  </Button>
                ) : null}
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label
                htmlFor="email"
                className="block text-base font-semibold text-foreground"
              >
                Email
              </Label>
              <div className="relative group">
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="emazouz@mail.com"
                  className="h-12 sm:h-14 pl-4 pr-12 bg-muted/50 border-input rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/20 transition-all duration-300 focus:shadow-lg focus:shadow-primary/10"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
                <Mail className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
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
                    Sending email...
                  </span>
                ) : (
                  "Send Reset Email"
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

export default ResetForm;
