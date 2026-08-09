/**
 * Initialize Vercel Postgres: schema, seed data, and default admin user.
 *
 * Usage: POSTGRES_URL=... AUTH_SECRET=... node scripts/init-db.mjs
 * Optional: ADMIN_EMAIL, ADMIN_PASSWORD (defaults: admin@store.com / Admin123!)
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { createPool } from "@vercel/postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));

const adminEmail = process.env.ADMIN_EMAIL ?? "admin@store.com";
const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin123!";

if (!process.env.POSTGRES_URL) {
  console.error("POSTGRES_URL is required");
  process.exit(1);
}

const pool = createPool({ connectionString: process.env.POSTGRES_URL });

async function runSqlFile(filename) {
  const sql = readFileSync(join(__dirname, filename), "utf8");
  await pool.query(sql);
  console.log(`Applied ${filename}`);
}

async function seedAdmin() {
  const passwordHash = bcrypt.hashSync(adminPassword, 10);
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, full_name, is_admin)
     VALUES ($1, $2, 'Store Admin', true)
     ON CONFLICT (email) DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       is_admin = true
     RETURNING id, email`,
    [adminEmail, passwordHash]
  );
  console.log(`Admin user ready: ${result.rows[0].email}`);
}

async function main() {
  await runSqlFile("schema.sql");
  await runSqlFile("seed.sql");
  await seedAdmin();
  console.log("Database initialized successfully.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
