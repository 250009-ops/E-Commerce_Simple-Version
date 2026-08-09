"use server";

import { redirect } from "next/navigation";
import { sql, isDatabaseConfigured } from "@/lib/db";
import {
  createSession,
  deleteSession,
  getSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import type { SessionUser } from "@/types/database";

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isDatabaseConfigured()) return null;
  return getSession();
}

export async function signIn(formData: FormData) {
  if (!isDatabaseConfigured()) {
    return {
      error:
        "Database is not configured. Set POSTGRES_URL and AUTH_SECRET in your environment.",
    };
  }

  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || "/";

  const { rows } = await sql`
    SELECT id, email, password_hash, full_name, is_admin
    FROM users WHERE email = ${email}
  `;

  const user = rows[0];
  if (!user || !(await verifyPassword(password, user.password_hash as string))) {
    return { error: "Invalid email or password" };
  }

  await createSession({
    id: user.id as string,
    email: user.email as string,
    fullName: user.full_name as string | null,
    isAdmin: Boolean(user.is_admin),
  });

  redirect(redirectTo);
}

export async function signUp(formData: FormData) {
  if (!isDatabaseConfigured()) {
    return {
      error:
        "Database is not configured. Set POSTGRES_URL and AUTH_SECRET in your environment.",
    };
  }

  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;
  const fullName = (formData.get("fullName") as string).trim();

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.rows.length > 0) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await hashPassword(password);
  const { rows } = await sql`
    INSERT INTO users (email, password_hash, full_name)
    VALUES (${email}, ${passwordHash}, ${fullName})
    RETURNING id, email, full_name, is_admin
  `;

  const user = rows[0];
  await createSession({
    id: user.id as string,
    email: user.email as string,
    fullName: user.full_name as string | null,
    isAdmin: Boolean(user.is_admin),
  });

  redirect("/");
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}
