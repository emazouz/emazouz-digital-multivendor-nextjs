import { Metadata } from "next";
import Banner from "@/modules/home/components/banner";

export const metadata: Metadata = {
  title: "Home",
  description: "Home",
};

export default function Home() {
  return (
    <main className="flex-center min-h-screen w-full flex-col">
      <Banner />
    </main>
  );
}
