"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "motion/react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import Logo from "@/shared/components/logo";
import { ModeToggle } from "@/modules/home/components/header/mode-toggle";
import {
  Eye,
  EyeClosed,
  Mail,
  AlertCircle,
  User,
  Store,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { Loader } from "@/shared/components/ui/loader";
import LeftSideAuth from "./left-side";
import { registerAction, oauthLoginAction } from "../actions/auth.actions";
import { UserRole } from "@prisma/client";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  storeName: string;
  agreeTerms: boolean;
}

const RegisterForm = () => {
  const [step, setStep] = useState<"select-role" | "form">("select-role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    agreeTerms: false,
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep("form");
  };

  const handleBack = () => {
    setStep("select-role");
    setSelectedRole(null);
    setError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError("Please agree to the Terms of Service.");
      setIsLoading(false);
      return;
    }

    if (!selectedRole) {
      setError("Please select a role.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerAction({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: selectedRole || "USER",
        storeName: formData.storeName || undefined,
      });

      if (result.success) {
        setSuccessMessage(
          result.message ||
            "Registration successful! Please check your email to verify your account.",
        );
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      await oauthLoginAction("google");
    } catch {
      setError("Failed to sign up with Google. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGitHubSignUp = async () => {
    try {
      setIsLoading(true);
      await oauthLoginAction("github");
    } catch {
      setError("Failed to sign up with GitHub. Please try again.");
      setIsLoading(false);
    }
  };
  // Animation variants
  const containerVariants: Variants = {
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

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Decorative */}
      <LeftSideAuth />

      {/* Right Side - Form */}
      <div className="relative flex items-center justify-center p-6 sm:p-8 md:p-12 bg-background order-2 lg:order-1 overflow-hidden">
        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:right-auto lg:left-6"
        >
          <ModeToggle />
        </motion.div>

        <div className="w-full max-w-md mx-auto">
          <AnimatePresence mode="wait" custom={step === "form" ? 1 : -1}>
            {step === "select-role" ? (
              <motion.div
                key="select-role"
                custom={-1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {/* Logo */}
                  <motion.div variants={itemVariants}>
                    <Logo />
                  </motion.div>

                  {/* Title */}
                  <motion.h4
                    variants={itemVariants}
                    className="text-3xl sm:text-4xl font-bold text-foreground mb-3"
                  >
                    Create Account
                  </motion.h4>

                  <motion.p
                    variants={itemVariants}
                    className="text-muted-foreground mb-8"
                  >
                    How would you like to use Emazouz Digital?
                  </motion.p>

                  {/* Role Selection Cards */}
                  <motion.div
                    variants={itemVariants}
                    className="grid gap-4 mb-8"
                  >
                    {/* Customer Card */}
                    <button
                      type="button"
                      onClick={() => handleRoleSelect("USER")}
                      className="group relative p-6 rounded-2xl border-2 border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                          <ShoppingBag className="w-7 h-7 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                            I&apos;m a Customer
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Browse and purchase digital products, templates, and
                            assets.
                          </p>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-border group-hover:border-primary group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </button>

                    {/* Seller Card */}
                    <button
                      type="button"
                      onClick={() => handleRoleSelect("VENDOR")}
                      className="group w-full relative pt-8 pb-6 px-6 rounded-2xl border-2 border-border/50 bg-card/50 hover:border-secondary/50 hover:bg-secondary/5 transition-all duration-300 text-left"
                    >
                      <div className="absolute -top-3 right-6">
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                          <Sparkles className="w-3 h-3" />
                          Earn Money
                        </span>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/20 to-violet-500/20 flex items-center justify-center group-hover:from-secondary/30 group-hover:to-violet-500/30 transition-colors">
                          <Store className="w-7 h-7 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-lg text-foreground mb-1 group-hover:text-secondary transition-colors">
                            I&apos;m a Seller
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Create your store and start selling your digital
                            creations.
                          </p>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-border group-hover:border-secondary group-hover:bg-secondary/10 transition-colors flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </button>
                  </motion.div>

                  {/* Sign In Link */}
                  <motion.div variants={itemVariants} className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        href="/auth/login"
                        className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium transition-colors"
                      >
                        Sign in
                      </Link>
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : successMessage ? (
              // Email Verification Sent - Success State
              <motion.div
                key="success"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="text-center"
                >
                  {/* Logo */}
                  <motion.div variants={itemVariants}>
                    <Logo />
                  </motion.div>

                  {/* Success Icon */}
                  <motion.div
                    variants={itemVariants}
                    className="mt-12 mb-8 flex justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.3,
                      }}
                      className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center"
                    >
                      <Mail className="w-12 h-12 text-green-500" />
                    </motion.div>
                  </motion.div>

                  {/* Title */}
                  <motion.h4
                    variants={itemVariants}
                    className="text-2xl sm:text-3xl font-bold text-foreground mb-4"
                  >
                    Check Your Email
                  </motion.h4>

                  {/* Description */}
                  <motion.p
                    variants={itemVariants}
                    className="text-muted-foreground mb-2"
                  >
                    We&apos;ve sent a verification link to
                  </motion.p>

                  <motion.p
                    variants={itemVariants}
                    className="text-primary font-semibold mb-8"
                  >
                    {formData.email}
                  </motion.p>

                  <motion.p
                    variants={itemVariants}
                    className="text-sm text-muted-foreground mb-8"
                  >
                    Click the link in your email to verify your account and
                    complete registration.
                    <br />
                    Don&apos;t forget to check your spam folder!
                  </motion.p>

                  {/* Actions */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <Link href="/auth/login">
                      <Button className="w-full rounded-full h-12 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                        Go to Login
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setSuccessMessage("");
                        setFormData({
                          name: "",
                          email: "",
                          password: "",
                          confirmPassword: "",
                          storeName: "",
                          agreeTerms: false,
                        });
                        setStep("select-role");
                        setSelectedRole(null);
                      }}
                      className="w-full rounded-full h-12 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                    >
                      Register Another Account
                    </Button>
                  </motion.div>

                  {/* Help Link */}
                  <motion.div
                    variants={itemVariants}
                    className="text-center pt-8"
                  >
                    <p className="text-sm text-muted-foreground">
                      Didn&apos;t receive the email?{" "}
                      <button
                        type="button"
                        onClick={() =>
                          handleSubmit({
                            preventDefault: () => {},
                          } as React.FormEvent<HTMLFormElement>)
                        }
                        className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium transition-colors"
                      >
                        Resend verification email
                      </button>
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {/* Back Button */}
                  <motion.button
                    variants={itemVariants}
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back</span>
                  </motion.button>

                  {/* Logo */}
                  <motion.div variants={itemVariants}>
                    <Logo />
                  </motion.div>

                  {/* Title */}
                  <motion.h4
                    variants={itemVariants}
                    className="text-3xl sm:text-4xl font-bold text-foreground mb-2"
                  >
                    {selectedRole === "VENDOR"
                      ? "Create Seller Account"
                      : "Create Account"}
                  </motion.h4>

                  <motion.p
                    variants={itemVariants}
                    className="text-muted-foreground mb-6"
                  >
                    {selectedRole === "VENDOR"
                      ? "Set up your store and start selling"
                      : "Fill in your details to get started"}
                  </motion.p>

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

                  {/* Registration Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="block text-base font-semibold text-foreground"
                      >
                        Full Name
                      </Label>
                      <div className="relative group">
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="h-12 sm:h-14 pl-4 pr-12 bg-muted/50 border-input rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/20 transition-all duration-300 focus:shadow-lg focus:shadow-primary/10"
                          required
                          disabled={isLoading}
                          autoComplete="name"
                        />
                        <User className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      </div>
                    </motion.div>

                    {/* Store Name Field (Vendors Only) */}
                    {selectedRole === "VENDOR" && (
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label
                          htmlFor="storeName"
                          className="block text-base font-semibold text-foreground"
                        >
                          Store Name
                        </Label>
                        <div className="relative group">
                          <Input
                            type="text"
                            id="storeName"
                            name="storeName"
                            value={formData.storeName}
                            onChange={handleInputChange}
                            placeholder="My Awesome Store"
                            className="h-12 sm:h-14 pl-4 pr-12 bg-muted/50 border-input rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/20 transition-all duration-300 focus:shadow-lg focus:shadow-primary/10"
                            required
                            disabled={isLoading}
                          />
                          <Store className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                      </motion.div>
                    )}

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
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
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
                    <motion.div variants={itemVariants} className="space-y-2">
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
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="6+ characters, 1 Capital letter"
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
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
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

                    {/* Confirm Password Field */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="block text-base font-semibold text-foreground"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative group">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Re-enter your password"
                          className="h-12 sm:h-14 pl-4 pr-12 bg-muted/50 border-input rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/20 transition-all duration-300 focus:shadow-lg focus:shadow-primary/10"
                          required
                          minLength={6}
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeClosed className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </motion.div>

                    {/* Terms Checkbox */}
                    <motion.div
                      variants={itemVariants}
                      className="flex items-start gap-2 py-2"
                    >
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            agreeTerms: checked as boolean,
                          }))
                        }
                        disabled={isLoading}
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor="agreeTerms"
                        className="text-sm text-muted-foreground cursor-pointer select-none leading-relaxed"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="space-y-3 pt-2"
                    >
                      {/* Sign Up Button */}
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-full h-12 disabled:opacity-70 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <Loader size="sm" />
                            Creating account...
                          </span>
                        ) : (
                          "Create Account"
                        )}
                      </Button>

                      {/* Google Sign Up */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleSignUp}
                        disabled={isLoading}
                        className="w-full rounded-full h-12 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                      >
                        <Image
                          src="/assets/svg/google.svg"
                          alt="Google icon"
                          width={20}
                          height={20}
                        />
                        <span>Sign up with Google</span>
                      </Button>

                      {/* GitHub Sign Up */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGitHubSignUp}
                        disabled={isLoading}
                        className="w-full rounded-full h-12 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                      >
                        <Image
                          src="/assets/svg/github.svg"
                          alt="GitHub icon"
                          width={20}
                          height={20}
                        />
                        <span>Sign up with GitHub</span>
                      </Button>
                    </motion.div>

                    {/* Sign In Link */}
                    <motion.div
                      variants={itemVariants}
                      className="text-center pt-4"
                    >
                      <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                          href="/auth/login"
                          className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium transition-colors"
                          tabIndex={isLoading ? -1 : 0}
                        >
                          Sign in
                        </Link>
                      </p>
                    </motion.div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
