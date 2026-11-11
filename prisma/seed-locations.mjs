/**
 * Seeds Iran's provinces and cities from the SQL dumps in `data/`:
 *   data/provinces.sql  →  provinces (id, name)
 *   data/cities.sql     →  cities (id, province_id, name)
 *
 * Usage:
 *   npm run db:seed:locations      (also runs as part of `npm run db:seed`)
 *
 * Idempotent and safe in production: rows are upserted by id, so the source
 * ids stay stable (branches reference them) and re-running only syncs names.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaClient } from "@prisma/client";

const DATA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "data");

/** Parse a SQL string literal body ('...' with '' or \' escapes). */
function unquote(literal) {
  return literal.slice(1, -1).replace(/''/g, "'").replace(/\\'/g, "'").replace(/\\\\/g, "\\").trim();
}

/**
 * Read every `INSERT INTO `<table>` (...) VALUES (...)` row of a dump.
 * Handles one-row-per-statement and multi-row `VALUES (...), (...)` forms.
 */
async function readRows(file, table) {
  const sql = await readFile(path.join(DATA_DIR, file), "utf8");
  const rows = [];
  const statement = new RegExp(String.raw`INSERT INTO\s+\x60?${table}\x60?\s*\(([^)]*)\)\s*VALUES\s*([\s\S]*?);\s*(?=INSERT|$)`, "gi");
  const tuple = /\(\s*((?:'(?:[^'\\]|\\.|'')*'|[^()'])*?)\s*\)/g;
  const value = /'(?:[^'\\]|\\.|'')*'|[^,\s][^,]*/g;

  for (const match of sql.matchAll(statement)) {
    const columns = match[1].split(",").map((c) => c.replace(/\x60/g, "").trim());
    for (const t of match[2].matchAll(tuple)) {
      const values = (t[1].match(value) ?? []).map((v) => {
        const trimmed = v.trim();
        return trimmed.startsWith("'") ? unquote(trimmed) : trimmed === "NULL" ? null : Number(trimmed);
      });
      rows.push(Object.fromEntries(columns.map((column, i) => [column, values[i]])));
    }
  }
  return rows;
}

export async function seedLocations(prisma) {
  const provinces = await readRows("provinces.sql", "provinces");
  const cities = await readRows("cities.sql", "cities");
  if (provinces.length === 0 || cities.length === 0) {
    throw new Error(`[seed:locations] No rows read from ${DATA_DIR} (provinces: ${provinces.length}, cities: ${cities.length})`);
  }

  const provinceIds = new Set(provinces.map((p) => p.id));
  const orphans = cities.filter((c) => !provinceIds.has(c.province_id));
  if (orphans.length > 0) {
    throw new Error(`[seed:locations] ${orphans.length} cities point to unknown provinces (e.g. city id ${orphans[0].id})`);
  }

  // Provinces first (cities reference them); chunked transactions keep it fast.
  const chunk = (list, size) => Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, i * size + size));

  for (const part of chunk(provinces, 100)) {
    await prisma.$transaction(
      part.map((p) => prisma.province.upsert({ where: { id: p.id }, create: { id: p.id, name: p.name }, update: { name: p.name } }))
    );
  }
  for (const part of chunk(cities, 100)) {
    await prisma.$transaction(
      part.map((c) =>
        prisma.city.upsert({
          where: { id: c.id },
          create: { id: c.id, provinceId: c.province_id, name: c.name },
          update: { provinceId: c.province_id, name: c.name },
        })
      )
    );
  }

  console.log(`[seed:locations] ${provinces.length} provinces and ${cities.length} cities are in the database.`);
}

// Run directly: `node prisma/seed-locations.mjs`
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const prisma = new PrismaClient();
  seedLocations(prisma)
    .catch((error) => {
      console.error("[seed:locations] failed:", error);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
