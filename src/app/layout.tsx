import { ThemeProvider } from "@/shared/components/theme-provider";
import { Toaster } from "@/shared/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./font.css";
import { APP_NAME, APP_DESCRIPTION, APP_URL, APP_TITLE, AUTHOR_NAME } from "@/shared/constants/env";
import { AuthProvider } from "@/shared/providers/auth-provider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_NAME}`,
  },

  description: APP_DESCRIPTION,

  keywords: [
    "digital marketing",
    "web development",
    "SEO services",
    "brand strategy",
    "Emazouz Digital",
    "online marketing",
  ],

  authors: [{ name: AUTHOR_NAME, url: APP_URL }],
  creator: AUTHOR_NAME,
  publisher: AUTHOR_NAME,

  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: APP_TITLE,
    description:
      APP_DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Emazouz Digital - Digital Marketing Agency",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: APP_TITLE,
    description:
      APP_DESCRIPTION,
    creator: "@emazouz",
    images: ["/twitter-image.jpg"], 
  },

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

  verification: {
    google: "your-google-verification-code", 
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },

  // Canonical URL
  alternates: {
    canonical: APP_URL, 
  },

  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
