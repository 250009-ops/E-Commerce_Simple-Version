import { sql } from "@vercel/postgres";

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.POSTGRES_URL);
}

export { sql };
