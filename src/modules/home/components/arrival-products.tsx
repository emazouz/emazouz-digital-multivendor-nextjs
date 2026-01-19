import { Button } from "@/shared/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

function ArrivalProducts() {
  return (
    <div className="w-full bg-muted py-8">
      <div className="wrapper">
        <div className="flex-between">
          <h2 className="bold-h1 caveat-brush-regular">New Arrival Products</h2>
          <Link href="/products" className="text-primary">
            <Button variant={"outline"} className="px-4 rounded-full">
              <span>View All Products</span>
              <ExternalLink />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ArrivalProducts;
