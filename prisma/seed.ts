import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

// setup connection for prisma 7
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


// change content arabic to english

async function main() {
  console.time("⏱️ total time");
  console.log("🌱 starting comprehensive data entry...");

  // helper function to execute insertion operations in parallel
  async function seedData<T>(
    name: string,
    data: T[],
    action: (item: T) => Promise<unknown>,
  ) {
    console.log(`📌 processing ${name}...`);  
    for (const item of data) {
      await action(item);
    }
    console.log(`✅ finished processing ${name} (${data.length} item)`);
  }

  // ============================================================================
  // 1. define complete data
  // ============================================================================

  const tags = [
    { name: "Premium", slug: "premium" },
    { name: "Bestseller", slug: "bestseller" },
    { name: "New Arrival", slug: "new-arrival" },
    { name: "Featured", slug: "featured" },
    { name: "Trending", slug: "trending" },
    { name: "WordPress", slug: "wordpress" },
    { name: "WooCommerce", slug: "woocommerce" },
    { name: "Shopify", slug: "shopify" },
    { name: "React", slug: "react" },
    { name: "Next.js", slug: "nextjs" },
    { name: "Vue.js", slug: "vuejs" },
    { name: "Angular", slug: "angular" },
    { name: "Laravel", slug: "laravel" },
    { name: "Node.js", slug: "nodejs" },
    { name: "PHP", slug: "php" },
    { name: "Template", slug: "template" },
    { name: "Theme", slug: "theme" },
    { name: "Plugin", slug: "plugin" },
    { name: "Component", slug: "component" },
    { name: "UI Kit", slug: "ui-kit" },
    { name: "Admin Panel", slug: "admin-panel" },
    { name: "Dashboard", slug: "dashboard" },
    { name: "Landing Page", slug: "landing-page" },
    { name: "SaaS", slug: "saas" },
    { name: "E-commerce", slug: "ecommerce" },
    { name: "Corporate", slug: "corporate" },
    { name: "Portfolio", slug: "portfolio" },
    { name: "Blog", slug: "blog" },
    { name: "Business", slug: "business" },
    { name: "Startup", slug: "startup" },
    { name: "Agency", slug: "agency" },
    { name: "Education", slug: "education" },
    { name: "Medical", slug: "medical" },
    { name: "Restaurant", slug: "restaurant" },
    { name: "Real Estate", slug: "real-estate" },
    { name: "Travel", slug: "travel" },
    { name: "Fitness", slug: "fitness" },
    { name: "Photography", slug: "photography" },
    { name: "Responsive", slug: "responsive" },
    { name: "Modern", slug: "modern" },
    { name: "Minimal", slug: "minimal" },
    { name: "Creative", slug: "creative" },
    { name: "Professional", slug: "professional" },
    { name: "Clean", slug: "clean" },
    { name: "Dark Mode", slug: "dark-mode" },
    { name: "Light", slug: "light" },
    { name: "Colorful", slug: "colorful" },
    { name: "Flat Design", slug: "flat-design" },
    { name: "Material Design", slug: "material-design" },
    { name: "Mobile First", slug: "mobile-first" },
    { name: "SEO Optimized", slug: "seo-optimized" },
    { name: "Fast Loading", slug: "fast-loading" },
    { name: "Retina Ready", slug: "retina-ready" },
    { name: "Bootstrap", slug: "bootstrap" },
    { name: "Tailwind CSS", slug: "tailwind-css" },
    { name: "Animation", slug: "animation" },
    { name: "RTL Support", slug: "rtl-support" },
    { name: "Multilingual", slug: "multilingual" },
    { name: "Cross Browser", slug: "cross-browser" },
  ];

  const compatibles = [
    { name: "Elementor", version: "3.x", type: "Page Builder" },
    { name: "WPBakery", version: "6.x", type: "Page Builder" },
    { name: "Beaver Builder", version: null, type: "Page Builder" },
    { name: "Divi Builder", version: "4.x", type: "Page Builder" },
    { name: "Gutenberg", version: null, type: "Page Builder" },
    { name: "WooCommerce", version: "8.x", type: "Plugin" },
    { name: "WPML", version: "4.x", type: "Plugin" },
    { name: "Yoast SEO", version: null, type: "Plugin" },
    { name: "Contact Form 7", version: null, type: "Plugin" },
    { name: "ACF Pro", version: "6.x", type: "Plugin" },
    { name: "Slider Revolution", version: "6.x", type: "Plugin" },
    { name: "bbPress", version: null, type: "Plugin" },
    { name: "BuddyPress", version: null, type: "Plugin" },
    { name: "Easy Digital Downloads", version: null, type: "Plugin" },
    { name: "Underscores", version: null, type: "Framework" },
    { name: "Genesis Framework", version: null, type: "Framework" },
    { name: "Redux Framework", version: null, type: "Framework" },
    { name: "Bootstrap", version: "5.x", type: "Framework" },
    { name: "Foundation", version: "6.x", type: "Framework" },
    { name: "jQuery", version: "3.x", type: "Library" },
    { name: "React", version: "18.x", type: "Library" },
    { name: "Vue.js", version: "3.x", type: "Library" },
    { name: "Alpine.js", version: null, type: "Library" },
  ];

  const softwareVersions = [
    {
      software: "WordPress",
      version: "6.4",
      releaseDate: new Date("2023-11-07"),
    },
    {
      software: "WordPress",
      version: "6.3",
      releaseDate: new Date("2023-08-08"),
    },
    {
      software: "WordPress",
      version: "6.2",
      releaseDate: new Date("2023-03-28"),
    },
    {
      software: "WordPress",
      version: "6.1",
      releaseDate: new Date("2022-11-01"),
    },
    {
      software: "WordPress",
      version: "6.0",
      releaseDate: new Date("2022-05-24"),
    },
    { software: "PHP", version: "8.3", releaseDate: new Date("2023-11-23") },
    { software: "PHP", version: "8.2", releaseDate: new Date("2022-12-08") },
    { software: "PHP", version: "8.1", releaseDate: new Date("2021-11-25") },
    { software: "PHP", version: "8.0", releaseDate: new Date("2020-11-26") },
    { software: "PHP", version: "7.4", releaseDate: new Date("2019-11-28") },
    { software: "MySQL", version: "8.0", releaseDate: new Date("2018-04-19") },
    { software: "MySQL", version: "5.7", releaseDate: new Date("2015-10-21") },
    {
      software: "Node.js",
      version: "20.x",
      releaseDate: new Date("2023-04-18"),
    },
    {
      software: "Node.js",
      version: "18.x",
      releaseDate: new Date("2022-04-19"),
    },
    {
      software: "Node.js",
      version: "16.x",
      releaseDate: new Date("2021-04-20"),
    },
  ];

  const browsers = [
    { name: "Chrome", minVersion: "90+" },
    { name: "Firefox", minVersion: "88+" },
    { name: "Safari", minVersion: "14+" },
    { name: "Edge", minVersion: "90+" },
    { name: "Opera", minVersion: "76+" },
    { name: "Internet Explorer", minVersion: "11" },
  ];

  const features = [
    {
      name: "Fast Loading Speed",
      description: "Optimized for speed with lazy loading and minified assets",
      category: "Performance",
    },
    {
      name: "Lightweight Code",
      description: "Clean and optimized code for better performance",
      category: "Performance",
    },
    {
      name: "Caching Support",
      description: "Built-in caching mechanisms for faster page loads",
      category: "Performance",
    },
    {
      name: "SEO Optimized",
      description:
        "Search engine optimized with proper meta tags and schema markup",
      category: "SEO",
    },
    {
      name: "Schema Markup",
      description: "Structured data for better search engine visibility",
      category: "SEO",
    },
    {
      name: "XML Sitemap",
      description: "Automatic sitemap generation for search engines",
      category: "SEO",
    },
    {
      name: "Responsive Design",
      description: "Fully responsive on all devices and screen sizes",
      category: "UX",
    },
    {
      name: "Retina Ready",
      description: "High-resolution display support",
      category: "UX",
    },
    {
      name: "Touch Optimized",
      description: "Optimized for touch devices and mobile interactions",
      category: "UX",
    },
    {
      name: "Dark Mode",
      description: "Built-in dark mode support",
      category: "UX",
    },
    {
      name: "Smooth Animations",
      description: "Beautiful animations and transitions",
      category: "UX",
    },
    {
      name: "One Click Demo Import",
      description: "Import demo content with a single click",
      category: "Features",
    },
    {
      name: "Drag & Drop Builder",
      description: "Easy page building with drag and drop interface",
      category: "Features",
    },
    {
      name: "Unlimited Colors",
      description: "Customize colors with unlimited options",
      category: "Features",
    },
    {
      name: "Google Fonts",
      description: "Access to 800+ Google Fonts",
      category: "Features",
    },
    {
      name: "Custom Widgets",
      description: "Custom widgets for enhanced functionality",
      category: "Features",
    },
    {
      name: "Mega Menu",
      description: "Advanced mega menu with multiple columns",
      category: "Features",
    },
    {
      name: "Ajax Search",
      description: "Live search results without page reload",
      category: "Features",
    },
    {
      name: "Newsletter Integration",
      description: "Mailchimp and other newsletter service integration",
      category: "Features",
    },
    {
      name: "Translation Ready",
      description: "Ready for translation with .po and .mo files",
      category: "Localization",
    },
    {
      name: "RTL Support",
      description: "Right-to-left language support (Arabic, Hebrew)",
      category: "Localization",
    },
    {
      name: "WPML Compatible",
      description: "Full compatibility with WPML plugin",
      category: "Localization",
    },
    {
      name: "WooCommerce Ready",
      description: "Full WooCommerce integration for online stores",
      category: "E-commerce",
    },
    {
      name: "Product Quick View",
      description: "Quick product preview in popup",
      category: "E-commerce",
    },
    {
      name: "Wishlist",
      description: "Product wishlist functionality",
      category: "E-commerce",
    },
    {
      name: "Compare Products",
      description: "Product comparison feature",
      category: "E-commerce",
    },
    {
      name: "Detailed Documentation",
      description: "Comprehensive documentation with screenshots",
      category: "Support",
    },
    {
      name: "Video Tutorials",
      description: "Step-by-step video guides",
      category: "Support",
    },
    {
      name: "Regular Updates",
      description: "Frequent updates with new features and bug fixes",
      category: "Support",
    },
    {
      name: "Dedicated Support",
      description: "24/7 customer support via email and tickets",
      category: "Support",
    },
  ];

  // ============================================================================
  // 2. Data Seeding Execution
  // ============================================================================

  try {
    // 1. seed tags
    await seedData("Tags", tags, (tag) =>
      prisma.tag.upsert({ where: { slug: tag.slug }, update: {}, create: tag }),
    );

    // 2. seed compatibles
    await seedData("Compatibles", compatibles, (comp) =>
      prisma.compatible.upsert({
        where: { name: comp.name },
        update: {},
        create: comp,
      }),
    );

    await seedData("Software Versions", softwareVersions, (sv) =>
      prisma.softwareVersion.upsert({
        where: {
          software_version: { software: sv.software, version: sv.version },
        },
        update: {},
        create: sv,
      }),
    );

    await seedData("Browsers", browsers, (browser) =>
      prisma.browser.upsert({
        where: { name: browser.name },
        update: {},
        create: browser,
      }),
    );

    await seedData("Features", features, (feature) =>
      prisma.feature.upsert({
        where: { name: feature.name },
        update: {},
        create: feature,
      }),
    );

    // 2. seed users and vendors
    console.log("👤 adding users and vendors...");

    const adminUser = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        name: "Admin User",
        email: "admin@example.com",
        role: "ADMIN",
        image: "https://avatar.vercel.sh/admin",
      },
    });

    const vendorUser = await prisma.user.upsert({
      where: { email: "vendor@example.com" },
      update: {},
      create: {
        name: "TechStart Vendor",
        email: "vendor@example.com",
        role: "VENDOR",
        image: "https://avatar.vercel.sh/vendor",
      },
    });

    const customerUser = await prisma.user.upsert({
      where: { email: "user@example.com" },
      update: {},
      create: {
        name: "John Doe",
        email: "user@example.com",
        role: "USER",
        image: "https://avatar.vercel.sh/user",
      },
    });

    const vendorProfile = await prisma.vendor.upsert({
      where: { userId: vendorUser.id },
      update: {},
      create: {
        userId: vendorUser.id,
        storeName: "TechStart Studio",
        slug: "techstart-studio",
        about: "We create high-quality SaaS templates and admin dashboards.",
        totalSales: 1540,
        avatarUrl: "https://avatar.vercel.sh/techstart",
        location: "San Francisco, CA",
      },
    });

    console.log(`✅ added users: Admin, Vendor, User`);

    // 3. seed products
    console.log("📦 adding products...");

    const product1 = await prisma.product.upsert({
      where: { slug: "saas-admin-dashboard" },
      update: {},
      create: {
        title: "SaaS Admin Dashboard",
        slug: "saas-admin-dashboard",
        price: 49.0,
        currency: "USD",
        salesCount: 120,
        averageRating: 4.8,
        shortDescription:
          "A modern, responsive admin dashboard for SaaS applications.",
        longDescription:
          "This is a comprehensive admin dashboard template built with React and Tailwind CSS.",
        thumbnailUrl: "/assets/images/thumbs/product-img1.png",
        vendorId: vendorProfile.id,
        category: "THEME",
        status: "PUBLISHED",
        isHighResolution: true,
        isWidgetReady: true,
        layout: "Responsive",
        framework: "React",
        publishedAt: new Date(),
      },
    });

    const product2 = await prisma.product.upsert({
      where: { slug: "ecommerce-ui-kit" },
      update: {},
      create: {
        title: "E-commerce UI Kit",
        slug: "ecommerce-ui-kit",
        price: 29.0,
        currency: "USD",
        salesCount: 85,
        averageRating: 4.5,
        shortDescription: "Complete UI kit for e-commerce websites.",
        longDescription:
          "Boost your e-commerce development with this complete UI kit.",
        thumbnailUrl: "/assets/images/thumbs/product-img2.png",
        vendorId: vendorProfile.id,
        category: "THEME",
        status: "PUBLISHED",
        isHighResolution: true,
        layout: "Responsive",
        framework: "Figma",
        publishedAt: new Date(),
      },
    });
    console.log(`✅ added products`);

    // 4. link products to tags (Relations)
    console.log("🔗 linking products to tags...");

    // find required tags for linking
    const saasTag = await prisma.tag.findUnique({ where: { slug: "saas" } });
    const dashboardTag = await prisma.tag.findUnique({
      where: { slug: "dashboard" },
    });

    // link product 1 to tags (if found)
    if (saasTag && dashboardTag) {
      // use createMany if ProductTag table supports it
      // or use Promise.all to ensure security in linking
      const links = [
        { productId: product1.id, tagId: saasTag.id },
        { productId: product1.id, tagId: dashboardTag.id },
      ];

      // here we use createMany if supported in your model, or a simple loop
      // we will use a simple loop to ensure compatibility with any schema
      for (const link of links) {
        // make sure the model name matches the schema (ProductTag or productTag)
        // here we assume there is an intermediate model for the Many-to-Many relationship
        try {
          // note: if you use Implicit M-N you will not need this, but the original code refers to an explicit relationship
          await prisma.productTag
            .create({
              // make sure the name in prisma.schema is ProductTag
              data: link,
            })
            .catch(() => {}); // ignore error if link already exists
        } catch (e) {
          // ignore duplicate errors
        }
      }
    }
    console.log(`✅ linked relations successfully`);
  } catch (error) {
    console.error("❌ error occurred during data entry:", error);
    throw error;
  } finally {
    console.timeEnd("⏱️ total execution time");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
