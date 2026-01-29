"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Variants, motion } from "motion/react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import Logo from "@/shared/components/logo";
import { ModeToggle } from "@/modules/home/components/header/mode-toggle";
import { Eye, EyeClosed, Mail, AlertCircle } from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { Loader } from "@/shared/components/ui/loader";
import LeftSideAuth from "./left-side";
import { loginAction, oauthLoginAction } from "../actions/auth.actions";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await loginAction({ email, password, keepSignedIn });

      if (result.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(
          result.error || "Invalid email or password. Please try again.",
        );
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await oauthLoginAction("google");
    } catch {
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setIsLoading(true);
      await oauthLoginAction("github");
    } catch {
      setError("Failed to sign in with GitHub. Please try again.");
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
            Welcome Back!
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div variants={itemVariants} className="space-sm">
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

            {/* Password Field */}
            <motion.div variants={itemVariants} className="space-sm">
              <Label
                htmlFor="password"
                className="block text-base font-semibold text-foreground"
              >
                Password
              </Label>
              <div className="relative group">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6+ characters, 1 Capital letter"
                  className="h-12 sm:h-14 pl-4 pr-12 bg-muted/50 border-input rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/20 transition-all duration-300 focus:shadow-lg focus:shadow-primary/10"
                  required
                  minLength={6}
                  disabled={isLoading}
                  autoComplete="current-password"
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

            {/* Remember & Forgot */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2"
            >
              <div className="flex items-center gap-sm">
                <Checkbox
                  id="keep-signed-in"
                  checked={keepSignedIn}
                  onCheckedChange={(checked) =>
                    setKeepSignedIn(checked as boolean)
                  }
                  disabled={isLoading}
                />
                <Label
                  htmlFor="keep-signed-in"
                  className="text-sm cursor-pointer select-none"
                >
                  Keep me signed in
                </Label>
              </div>
              <Link
                href="/auth/reset-password"
                className="text-sm text-primary hover:text-primary/80 underline underline-offset-2 font-medium transition-colors"
                tabIndex={isLoading ? -1 : 0}
              >
                Forgot password?
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3 pt-4">
              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full h-12 disabled:opacity-70 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                {isLoading ? (
                  <span className="flex items-center gap-sm">
                    <Loader size="sm" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full rounded-full h-12 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <Image
                  src="/assets/svg/google.svg"
                  alt="Google icon"
                  width={20}
                  height={20}
                />
                <span>Sign in with Google</span>
              </Button>

              {/* GitHub Sign In */}
              <Button
                type="button"
                variant={"outline"}
                onClick={handleGitHubSignIn}
                disabled={isLoading}
                className="w-full rounded-full h-12 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <Image
                  src="/assets/svg/github.svg"
                  alt="GitHub icon"
                  width={20}
                  height={20}
                />
                <span>Sign in with GitHub</span>
              </Button>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div variants={itemVariants} className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                New to the market?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium transition-colors"
                  tabIndex={isLoading ? -1 : 0}
                >
                  Sign up
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default LoginForm;
