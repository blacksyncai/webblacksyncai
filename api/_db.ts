/**
 * Lazy Postgres connection for the Helcim signup flow (api/_signup.ts).
 *
 * Only used by the signup endpoints today — nothing else in api/ touches a
 * database. Requires DATABASE_URL (a real Postgres instance, e.g. Neon or
 * Vercel Postgres). Returns null when it isn't set, so a deploy without a
 * database configured degrades to "signup not configured" instead of
 * throwing — same graceful-degradation idiom as api/_helcim.ts.
 *
 * The pool is cached on the module scope so warm Vercel function instances
 * reuse it instead of opening a new connection per request. Kept small
 * (max: 3) since each concurrent lambda instance gets its own pool — a
 * traffic spike can otherwise open far more Postgres connections than the
 * database allows. If that becomes a real constraint, swap this for a
 * serverless-native driver (e.g. @neondatabase/serverless over HTTP) rather
 * than raising the pool size.
 */
import { Pool } from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../shared/schema";

let db: NodePgDatabase<typeof schema> | null = null;

export function getDb(): NodePgDatabase<typeof schema> | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  if (!db) {
    const pool = new Pool({ connectionString, max: 3 });
    db = drizzle(pool, { schema });
  }
  return db;
}
