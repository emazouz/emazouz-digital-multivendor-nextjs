// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/auth/verify-email",
          "/auth/reset-password",
          "/api/",
          "/_next/",
        ],
      },
    ],
    sitemap: "https://www.emazouz.com/sitemap.xml",
  };
}
