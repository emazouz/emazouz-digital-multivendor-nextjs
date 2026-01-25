import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

// 1. إعداد الاتصال بنفس طريقة seed.ts
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔍 جاري فحص البيانات...");

  const products = await prisma.product.findMany({
    take: 2,
  });

  if (products.length > 0) {
    console.log(`✅ تم العثور على ${products.length} منتجات:`);
    console.log(JSON.stringify(products, null, 2));
  } else {
    console.log("⚠️ قاعدة البيانات متصلة لكنها فارغة!");
  }
}

main()
  .catch((e) => {
    console.error("❌ خطأ في الاتصال:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
