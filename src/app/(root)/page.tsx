import { Metadata } from "next";
import Banner from "@/modules/home/components/banner";
import PopularCategories from "@/modules/home/components/popular-categories";
import ArrivalProducts from "@/modules/home/components/arrival-products";

export const metadata: Metadata = {
  title: "Home",
  description: "Home",
};

export default function Home() {
  return (
    <main className="flex-center min-h-screen w-full flex-col gap-16">
      <Banner />
      <PopularCategories />
      <ArrivalProducts />
    </main>
  );
}
