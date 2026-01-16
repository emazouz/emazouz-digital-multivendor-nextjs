"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { useCountdown } from "@/shared/hooks/use-countdown";

interface SaleOfferProps {
  targetDate?: string;
}

function SaleOffer({ targetDate = "2026-11-14" }: SaleOfferProps) {
  const [isOpen, setIsOpen] = useState(true);
  const timeLeft = useCountdown(targetDate);

  if (!isOpen) return null;

  return (
    <div className="bg-primary text-primary-foreground h-[50px] block transition-all duration-300 ease-in-out">
      <div className="wrapper h-full flex items-center justify-between px-4">
        {/* sale offer date */}
        <div className="hidden md:flex items-center gap-3 font-medium">
          <p className="text-sm">
            <span className="font-bold">{timeLeft.days}</span> Days
          </p>
          <p className="text-sm">
            <span className="font-bold">{timeLeft.hours}</span> Hours
          </p>
          <p className="text-sm">
            <span className="font-bold">{timeLeft.minutes}</span> Min
          </p>
          <p className="text-sm">
            <span className="font-bold">{timeLeft.seconds}</span> Sec
          </p>
        </div>

        {/* sale offer title */}
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <p className="text-sm font-medium">
            New Year Flash Sale Offer{" "}
            <strong className="text-md ml-1 text-yellow-300">45% OFF</strong>
          </p>
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="rounded-full ml-2 h-7 text-xs px-3"
          >
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>

        {/* close button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-8 w-8 hover:bg-primary-foreground/20 text-primary-foreground"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close sale offer</span>
        </Button>
      </div>
    </div>
  );
}

export default SaleOffer;
