"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { motion } from "motion/react";

const techStack = [
  { name: "WordPress", icon: "/assets/images/thumbs/tech-icon1.png" },
  { name: "Laravel", icon: "/assets/images/thumbs/tech-icon2.png" },
  { name: "PHP", icon: "/assets/images/thumbs/tech-icon3.png" },
  { name: "HTML", icon: "/assets/images/thumbs/tech-icon4.png" },
  { name: "Sketch", icon: "/assets/images/thumbs/tech-icon5.png" },
  { name: "Figma", icon: "/assets/images/thumbs/tech-icon6.png" },
  { name: "Bootstrap", icon: "/assets/images/thumbs/tech-icon7.png" },
  { name: "Tailwind", icon: "/assets/images/thumbs/tech-icon8.png" },
  { name: "React", icon: "/assets/images/thumbs/tech-icon9.png" },
];

const Banner = () => {
  return (
    <section className="relative overflow-hidden w-full py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 select-none">
        <Image
          src="/assets/images/gradients/banner-gradient.png"
          alt=""
          fill
          className="object-cover opacity-50 dark:opacity-20"
        />
      </div>
      {/* Floating Shapes */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 z-0 hidden lg:block"
      >
        <Image
          src="/assets/images/shapes/element-moon1.png"
          alt=""
          width={60}
          height={60}
          className="opacity-60"
        />
      </motion.div>
      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 z-0 hidden lg:block"
      >
        <Image
          src="/assets/images/shapes/element-moon2.png"
          alt=""
          width={50}
          height={50}
          className="opacity-60"
        />
      </motion.div>

      <div className="wrapper relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Column: Content */}
          <div className="flex flex-col gap-6 ">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-foreground lg:text-7xl">
                2M+ curated digital products
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="max-w-xl text-lg text-muted-foreground">
                Explore the best premium themes and plugins available for sale.
                Our unique collection is hand-curated by experts. Find and buy
                the perfect premium theme today.
              </p>
            </motion.div>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-lg mt-4"
            >
              <input
                type="text"
                placeholder="Search theme, plugins & more..."
                className="h-14 w-full rounded-full border border-border bg-background/80 pl-8 pr-16 text-lg shadow-lg backdrop-blur-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105 hover:bg-primary/90"
              >
                <Search className="h-5 w-5" />
              </button>
            </motion.div>

            {/* Tech Stack List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center gap-4"
            >
              {techStack.map((tech, index) => (
                <Link
                  key={index}
                  href="/all-product"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md dark:bg-secondary"
                  title={tech.name}
                >
                  <Image
                    src={tech.icon}
                    alt={tech.name}
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                  />
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Image & Stats */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Dots Decoration */}
            <div className="absolute -left-10 -top-10 z-0 animate-pulse hidden lg:block">
              <Image
                src="/assets/images/shapes/dots.png"
                alt=""
                width={100}
                height={100}
                className="opacity-50 dark:invert"
              />
            </div>

            {/* Main Banner Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 w-full max-w-lg"
            >
              <Image
                src="/assets/images/thumbs/banner-img.png"
                alt="Banner Hero"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl object-cover"
                priority
              />
            </motion.div>

            {/* Stats Card 1: Customers */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute left-0 top-1/4 z-20 hidden md:block"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-[#635BFF] p-4 text-white shadow-xl backdrop-blur-md"
              >
                <h5 className="text-3xl font-bold">50k</h5>
                <span className="text-sm font-medium opacity-90">
                  Customers
                </span>
              </motion.div>
            </motion.div>

            {/* Stats Card 2: Themes & Plugins */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute -right-4 bottom-10 z-20 hidden md:block"
            >
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="flex min-w-[140px] flex-col items-center justify-center rounded-2xl bg-white p-6 text-center text-gray-900 shadow-xl dark:bg-card dark:text-card-foreground"
              >
                <h5 className="text-3xl font-bold text-gray-900 dark:text-white">
                  22k
                </h5>
                <span className="text-xs font-medium text-muted-foreground">
                  Themes & Plugins
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
