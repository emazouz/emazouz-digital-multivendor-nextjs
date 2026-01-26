import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  console.log("🌱 Starting database seed...");

  const adminEmail = "emazouz.dev@gmail.com";

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("⚠️  Admin user already exists, skipping...");
  } else {
    const hashedPassword = await hashPassword("Inkal990inkal900");

    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        emailVerified: new Date(),
        password: hashedPassword,
        role: UserRole.ADMIN,
        image: null,
      },
    });

    console.log("✅ Admin user created:", {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  }

  console.log("🎉 Database seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
