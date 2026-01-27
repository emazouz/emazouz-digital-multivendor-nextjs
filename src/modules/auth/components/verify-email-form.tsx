"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Variants, motion } from "motion/react";
import { Button } from "@/shared/components/ui/button";
import Logo from "@/shared/components/logo";
import { ModeToggle } from "@/modules/home/components/header/mode-toggle";
import { CheckCircle, XCircle, Mail, ArrowRight } from "lucide-react";
import { Loader } from "@/shared/components/ui/loader";
import LeftSideAuth from "./left-side";
import { verifyEmailAction } from "../actions/auth.actions";

const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    const verify = async () => {
      if (!token) {
        if (!ignore) {
          setStatus("error");
          setMessage(
            "No verification token provided. Please check your email link.",
          );
        }
        return;
      }

      try {
        const result = await verifyEmailAction(token);

        if (!ignore) {
          if (result.success) {
            setStatus("success");
            setMessage(
              result.message || "Your email has been verified successfully!",
            );
          } else {
            setStatus("error");
            setMessage(
              result.error || "Verification failed. Please try again.",
            );
          }
        }
      } catch {
        if (!ignore) {
          setStatus("error");
          setMessage("An unexpected error occurred. Please try again.");
        }
      }
    };

    verify();

    return () => {
      ignore = true;
    };
  }, [token]);

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

  const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Decorative */}
      <LeftSideAuth />

      {/* Right Side - Verification Status */}
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
          className="w-full max-w-md mx-auto text-center"
        >
          {/* Logo */}
          <motion.div variants={itemVariants}>
            <Logo />
          </motion.div>

          {/* Status Content */}
          {status === "loading" && (
            <>
              <motion.div
                variants={itemVariants}
                className="mt-12 mb-8 flex justify-center"
              >
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader size="lg" />
                </div>
              </motion.div>

              <motion.h4
                variants={itemVariants}
                className="text-2xl sm:text-3xl font-bold text-foreground mb-4"
              >
                Verifying Your Email
              </motion.h4>

              <motion.p
                variants={itemVariants}
                className="text-muted-foreground"
              >
                Please wait while we verify your email address...
              </motion.p>
            </>
          )}

          {status === "success" && (
            <>
              <motion.div
                variants={iconVariants}
                className="mt-12 mb-8 flex justify-center"
              >
                <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-14 h-14 text-green-500" />
                </div>
              </motion.div>

              <motion.h4
                variants={itemVariants}
                className="text-2xl sm:text-3xl font-bold text-foreground mb-4"
              >
                Email Verified!
              </motion.h4>

              <motion.p
                variants={itemVariants}
                className="text-muted-foreground mb-8"
              >
                {message}
              </motion.p>

              <motion.div variants={itemVariants}>
                <Link href="/auth/login">
                  <Button className="rounded-full h-12 px-8 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                    <span>Continue to Login</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </>
          )}

          {status === "error" && (
            <>
              <motion.div
                variants={iconVariants}
                className="mt-12 mb-8 flex justify-center"
              >
                <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-14 h-14 text-destructive" />
                </div>
              </motion.div>

              <motion.h4
                variants={itemVariants}
                className="text-2xl sm:text-3xl font-bold text-foreground mb-4"
              >
                Verification Failed
              </motion.h4>

              <motion.p
                variants={itemVariants}
                className="text-muted-foreground mb-8"
              >
                {message}
              </motion.p>

              <motion.div variants={itemVariants} className="space-y-3">
                <Link href="/auth/register">
                  <Button className="w-full rounded-full h-12 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>Register Again</span>
                  </Button>
                </Link>

                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="w-full rounded-full h-12 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    <span>Back to Login</span>
                  </Button>
                </Link>
              </motion.div>
            </>
          )}

          {/* Footer Text */}
          <motion.div variants={itemVariants} className="text-center pt-12">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link
                href="/contact"
                className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium transition-colors"
              >
                Contact Support
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VerifyEmailForm;
