import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function LeftSideAuth() {
  return (
    <div className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-muted via-muted/80 to-background order-1 lg:order-2">
      {/* Animated Background Layers */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-secondary/25 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/3 w-[200px] h-[200px] bg-violet-500/20 rounded-full blur-[80px]"
        />
      </div>

      {/* Pattern Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 pointer-events-none"
      >
        <Image
          src="/assets/images/shapes/pattern-curve-seven.png"
          alt="Pattern"
          fill
          className="object-cover object-center mix-blend-overlay"
          priority
        />
      </motion.div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-12">
        {/* Corner Decoration */}
        <motion.div
          initial={{ opacity: 0, x: 50, rotate: 10 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute top-0 right-0 z-20"
        >
          <Image
            src="/assets/images/thumbs/account-img.png"
            alt="Account decoration"
            width={140}
            height={140}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>

        {/* Hero Image with Effects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: -25 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 -m-8 bg-gradient-to-br from-primary/40 via-secondary/30 to-violet-500/40 rounded-full blur-3xl"
          />

          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/assets/images/thumbs/banner-img.png"
              alt="Welcome illustration"
              width={520}
              height={520}
              className="object-contain relative z-10 drop-shadow-[0_25px_60px_rgba(0,0,0,0.3)]"
              priority
            />
          </motion.div>

          {/* Customers Badge */}
          <motion.div
            initial={{ opacity: 0, x: 0, scale: 0.5 }}
            animate={{ opacity: 1, x: -60, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute top-0 left-0"
          >
            <motion.div
              animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative bg-gradient-to-br from-primary to-secondary rounded-2xl px-6 py-5 shadow-2xl border border-white/20 backdrop-blur-sm">
                  <div className="text-center text-primary-foreground">
                    <h5 className="text-3xl font-bold">50k+</h5>
                    <span className="text-xs font-medium opacity-90 block mt-1">
                      Happy Customers
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Products Badge */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.5 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute bottom-1 -right-4"
          >
            <motion.div
              animate={{ y: [5, -5, 5], rotate: [2, -2, 2] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-violet-500/50 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative bg-background/95 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-2xl border border-border/50">
                  <div className="text-center">
                    <h5 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      1k+
                    </h5>
                    <span className="text-xs font-medium text-muted-foreground">
                      Digital Products
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-12 text-center"
        >
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Join Our Community
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Start selling or buying premium digital assets today.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default LeftSideAuth;
