import SaleOffer from "@/modules/home/components/sale-offer";
import Header from "@/modules/home/components/header";
import { Metadata } from "next";
import Footer from "@/modules/home/components/footer";


export const metadata: Metadata = {
  title: "Emazouz Digital",
  description: "Emazouz Digital",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <SaleOffer />
      <Header />
      {children}
      <Footer />
    </main>
  );
}
