"use client";

import * as motion from "motion/react-client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-md">
        {/* Logo or Brand Element Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="relative"
        >
          {/* Marketplace Icon/Brand Visual Placeholder */}
          <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 shadow-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-white/20 rounded-full" />
          </div>
        </motion.div>

        {/* Text and Spinner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-sm"
        >
          <div className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Emazouz Digital
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading marketplace...
          </p>
          <div className="mt-4">
            {/* Progress Bar (Indeterminate) */}
            <div className="h-1 w-32 bg-secondary overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-primary"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
