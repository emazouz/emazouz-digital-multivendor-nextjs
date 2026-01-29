"use client";

import { memo, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const categories = [
  {
    id: 1,
    name: "Category 1",
    image: "/assets/images/thumbs/popular-item1.png",
    slug: "category-1",
  },
  {
    id: 2,
    name: "Category 2",
    image: "/assets/images/thumbs/popular-item2.png",
    slug: "category-2",
  },
  {
    id: 3,
    name: "Category 3",
    image: "/assets/images/thumbs/popular-item3.png",
    slug: "category-3",
  },
  {
    id: 4,
    name: "Category 4",
    image: "/assets/images/thumbs/popular-item4.png",
    slug: "category-4",
  },
  {
    id: 5,
    name: "Category 5",
    image: "/assets/images/thumbs/popular-item5.png",
    slug: "category-5",
  },
  {
    id: 6,
    name: "Category 6",
    image: "/assets/images/thumbs/popular-item6.png",
    slug: "category-6",
  },
  {
    id: 7,
    name: "Category 7",
    image: "/assets/images/thumbs/popular-item7.png",
    slug: "category-7",
  },
  {
    id: 8,
    name: "Category 8",
    image: "/assets/images/thumbs/popular-item8.png",
    slug: "category-8",
  },
  {
    id: 9,
    name: "Category 9",
    image: "/assets/images/thumbs/popular-item9.png",
    slug: "category-9",
  },
  {
    id: 10,
    name: "Category 10",
    image: "/assets/images/thumbs/popular-item10.png",
    slug: "category-10",
  },
  {
    id: 11,
    name: "Category 11",
    image: "/assets/images/thumbs/popular-item11.png",
    slug: "category-11",
  },
];

const PopularCategories = memo(function PopularCategories() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="bg-background/80 w-full py-8">
      <div className="wrapper flex flex-col gap-lg">
        <div className="flex items-center justify-between">
          <h2 className="bold-h1 caveat-brush-regular">Popular Categories</h2>
          <div className="flex items-center gap-sm">
            <Button
              onClick={scrollPrev}
              variant={"outline"}
              size={"icon"}
              className="rounded-full"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              onClick={scrollNext}
              variant={"outline"}
              size={"icon"}
              className="rounded-full"
              aria-label="Next slide"
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>

        <div
          className="overflow-hidden relative"
          ref={emblaRef}
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          }}
        >
          <div className="flex gap-4 touch-pan-y py-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="flex-[0_0_auto] min-w-0 w-[140px] md:w-[160px] cursor-pointer group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-full aspect-square rounded-full overflow-hidden border border-border group-hover:border-primary transition-colors">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default PopularCategories;
