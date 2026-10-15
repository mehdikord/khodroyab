/**
 * Development seeder for the Khodroyab administrator account.
 *
 * Usage:
 *   npm run db:seed
 *
 * Development credentials:
 *   phone:    09117926950
 *   password: 123456
 *
 * WARNING: the test password in this file is for local development only.
 * It must be changed (or the account removed) before any real deployment.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const DEV_ADMIN = {
  name: "Admin",
  phone: "09117926950",
  password: "123456",
  email: null,
};

const BCRYPT_ROUNDS = 12;

function assertDevelopmentEnvironment() {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[seed] Refusing to create the development administrator in a production environment. " +
        "This seeder is strictly for local development and testing."
    );
  }
}

async function main() {
  assertDevelopmentEnvironment();

  const prisma = new PrismaClient();
  try {
    const passwordHash = await bcrypt.hash(DEV_ADMIN.password, BCRYPT_ROUNDS);

    // Idempotent: repeated runs never create duplicates thanks to the
    // unique `admins.phone` constraint.
    const admin = await prisma.admin.upsert({
      where: { phone: DEV_ADMIN.phone },
      update: {
        name: DEV_ADMIN.name,
        email: DEV_ADMIN.email,
        password: passwordHash,
      },
      create: {
        name: DEV_ADMIN.name,
        phone: DEV_ADMIN.phone,
        email: DEV_ADMIN.email,
        password: passwordHash,
      },
      select: { id: true, name: true, phone: true, email: true },
    });

    console.log(
      `[seed] Development administrator ready: id=${admin.id.toString()} name=${admin.name} phone=${admin.phone}`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("[seed] Seeding failed:", error);
  process.exit(1);
});
