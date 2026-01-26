import "dotenv/config";
import prisma from "../src/shared/lib/prisma";

async function main() {
  console.log("Connecting to database...");
  try {
    const userCount = await prisma.user.count();
    console.log(`Successfully connected! Found ${userCount} users.`);

    // Try to find a user (simulating the authorize call)
    const email = "emazouz.dev@gmail.com";
    console.log(`Looking for user with email: ${email}`);
    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log("User found:", user);
  } catch (error) {
    console.error("Error connecting to database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
