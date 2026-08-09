import { sql } from "@vercel/postgres";

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.POSTGRES_URL);
}

/** True when running without Postgres — uses in-memory demo data and JWT auth. */
export function isDemoMode(): boolean {
  return !isDatabaseConfigured();
}

export { sql };
