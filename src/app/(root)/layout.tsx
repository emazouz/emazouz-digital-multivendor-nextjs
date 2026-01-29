import SaleOffer from "@/modules/home/components/sale-offer";
import Header from "@/modules/home/components/header";
import type { Metadata } from "next";
import Footer from "@/modules/home/components/footer";

export const metadata: Metadata = {
  // Enhanced title
  title: "Emazouz Digital - Digital Marketing & Web Development Agency",

  // Detailed description (150-160 characters)
  description:
    "Emazouz Digital specializes in digital marketing, web development, SEO, and social media management. We help businesses grow and reach their target audience online.",

  // Keywords
  keywords: [
    "digital marketing",
    "web development",
    "SEO services",
    "search engine optimization",
    "social media management",
    "website design",
    "Emazouz Digital",
    "digital marketing Morocco",
    "web development agency",
    "e-commerce solutions",
    "brand strategy",
    "online marketing",
  ],

  // Author information
  authors: [{ name: "Emazouz Digital" }],
  creator: "Emazouz Digital",
  publisher: "Emazouz Digital",

  // Open Graph for social media sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.emazouz.com",
    siteName: "Emazouz Digital",
    title: "Emazouz Digital - Digital Marketing & Web Development Agency",
    description:
      "Specialized agency in digital marketing, web development, and SEO services to help businesses achieve digital growth.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Emazouz Digital - Digital Marketing Agency",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Emazouz Digital - Digital Marketing & Web Development Agency",
    description:
      "Specialized agency in digital marketing, web development, and SEO services.",
    creator: "@emazouz",
    images: ["/images/twitter-image.jpg"],
  },

  // Robots settings
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons (Next.js 15+ preferred method)
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },

  // Manifest for PWA
  manifest: "/manifest.json",

  // Search engine verification
  verification: {
    google: "your-google-verification-code",
  },

  // Category
  category: "technology",

  // Additional metadata
  metadataBase: new URL("https://www.emazouz.com"), // Important for Next.js 15+

  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "ar-MA": "/ar",
      "fr-FR": "/fr",
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Emazouz Digital",
    url: "https://www.emazouz.com",
    logo: "https://www.emazouz.com/logo.png",
    description:
      "Digital marketing and web development agency specializing in SEO, social media, and brand strategy",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Casablanca",
      addressRegion: "Casablanca-Settat",
      addressCountry: "MA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+212-XXX-XXX-XXX",
      contactType: "customer service",
      availableLanguage: ["English", "Arabic", "French"],
    },
    sameAs: [
      "https://www.facebook.com/emazouz",
      "https://www.instagram.com/emazouz",
      "https://www.linkedin.com/company/emazouz",
      "https://twitter.com/emazouz",
    ],
    areaServed: {
      "@type": "Country",
      name: "Morocco",
    },
    serviceType: [
      "Digital Marketing",
      "Web Development",
      "SEO Services",
      "Social Media Management",
      "Brand Strategy",
      "E-commerce Solutions",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        <SaleOffer />
        <Header />
        {children}
        <Footer />
      </main>
    </>
  );
}
