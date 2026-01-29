import type { Metadata } from "next";
import Banner from "@/modules/home/components/banner";
import PopularCategories from "@/modules/home/components/popular-categories";
import ArrivalProducts from "@/modules/home/components/arrival-products";
import Featured from "@/modules/home/components/featured";

export const metadata: Metadata = {
  title: "Emazouz Digital - Premium Digital Products & Services Online Store",
  description:
    "Shop premium digital products, web templates, graphics, and marketing services at Emazouz Digital. Fast delivery, competitive prices, and excellent customer support in Morocco.",
  keywords: [
    "online store Morocco",
    "digital products",
    "web templates",
    "graphics design",
    "digital services",
    "e-commerce Morocco",
    "buy online Morocco",
  ],
  openGraph: {
    title: "Emazouz Digital - Premium Digital Products Online Store",
    description:
      "Shop premium digital products and services. Fast delivery and competitive prices.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/images/shop-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Emazouz Digital Online Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emazouz Digital - Premium Digital Products Online Store",
    description: "Shop premium digital products and services.",
    images: ["/images/shop-twitter-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  // JSON-LD for E-commerce Store
  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "Emazouz Digital",
    description: "Premium digital products and services online store",
    url: "https://www.emazouz.com",
    logo: "https://www.emazouz.com/logo.png",
    image: "https://www.emazouz.com/images/store-banner.jpg",
    telephone: "+212-XXX-XXX-XXX",
    email: "info@emazouz.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Casablanca",
      addressRegion: "Casablanca-Settat",
      addressCountry: "MA",
    },
    priceRange: "$$",
    currenciesAccepted: "MAD, USD, EUR",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    openingHours: "Mo-Fr 09:00-18:00",
    sameAs: [
      "https://www.facebook.com/emazouz",
      "https://www.instagram.com/emazouz",
    ],
  };

  // JSON-LD for Product Offers
  const offersJsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Emazouz Digital Products",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Web Development Services",
          description: "Professional website development",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Digital Marketing Packages",
          description: "Complete digital marketing solutions",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersJsonLd) }}
      />

      <main className="flex items-center justify-center min-h-screen w-full flex-col gap-16">
        <Banner />
        <PopularCategories />
        <ArrivalProducts />
        <Featured />
      </main>
    </>
  );
}
