import { defineConfig } from "drizzle-kit";

// Prefers a non-pooled connection for schema migrations (safer for DDL
// through a pooler), falling back to whatever's actually set. POSTGRES_URL /
// POSTGRES_URL_NON_POOLING are the names Vercel's own Postgres integration
// (Storage tab, Neon-backed) auto-injects — see api/_db.ts for the same
// fallback at runtime.
const connectionString =
  process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "No database connection string found. Set DATABASE_URL, or connect Vercel Postgres (Storage tab) which provides POSTGRES_URL.",
  );
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
