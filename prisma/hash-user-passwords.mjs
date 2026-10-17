/**
 * One-off maintenance script: hash every `users.password` that is still stored
 * as plaintext (rows created before bcrypt hashing was enforced).
 *
 * Safe to run repeatedly – rows that already hold a bcrypt hash are skipped.
 *
 *   npm run db:hash-user-passwords
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;
const BCRYPT_HASH_REGEX = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, phone: true, password: true } });

  let upgraded = 0;
  let skipped = 0;
  let empty = 0;

  for (const user of users) {
    if (BCRYPT_HASH_REGEX.test(user.password)) {
      skipped += 1;
      continue;
    }
    if (!user.password) {
      // Nothing sensible to hash; the admin must set a password for this account.
      empty += 1;
      console.warn(`[hash-user-passwords] user #${user.id} (${user.phone}) has an empty password – skipped`);
      continue;
    }
    const hashed = await bcrypt.hash(user.password, BCRYPT_ROUNDS);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    upgraded += 1;
  }

  console.log(
    `[hash-user-passwords] done – ${upgraded} upgraded, ${skipped} already hashed, ${empty} empty (total ${users.length})`
  );
}

main()
  .catch((error) => {
    console.error("[hash-user-passwords] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
