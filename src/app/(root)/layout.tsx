import SaleOffer from "@/shared/components/sale-0ffer";
import { Metadata } from "next";

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
      {children}
    </main>
  );
}
