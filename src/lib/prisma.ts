import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client singleton.
 *
 * In development, Next.js hot-reloads modules which would otherwise create a new
 * PrismaClient (and a new connection pool) on every reload. We cache the instance
 * on the global object to reuse a single client during development.
 *
 * This module must only ever be imported from server-side code.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
