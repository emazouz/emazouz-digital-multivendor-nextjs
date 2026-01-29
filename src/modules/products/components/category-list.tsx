"use client";

import { Button } from "@/shared/components/ui/button";

import { motion } from "motion/react"; // Assuming motion/react as per previous context or framer-motion
import Link from "next/link";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { getAllCategories } from "@/modules/products/services/categories.service";
import { useSearchParams } from "next/navigation";

function CategoryList() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "All";

  const categories = getAllCategories();

  return (
    <SimpleBar className="w-full pb-4">
      <motion.div
        className="flex items-center justify-center gap-3 min-w-max px-1"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <Link href={"/?category=All"} scroll={false}>
            <Button
              variant={category === "All" ? "default" : "outline"}
              size="sm"
              className="rounded-full px-6 h-9"
            >
              All
            </Button>
          </Link>
        </motion.div>
        {categories.map((c) => (
          <motion.div
            key={c}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <Link href={`/?category=${c}`} scroll={false}>
              <Button
                variant={category === c ? "default" : "outline"}
                size="sm"
                className="rounded-full px-6 h-9 capitalize"
              >
                {c.toLowerCase().replace("_", " ")}
              </Button>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </SimpleBar>
  );
}

export default CategoryList;
