"use server";

import { redirect } from "next/navigation";
import { sql, isDemoMode } from "@/lib/db";
import {
  createSession,
  deleteSession,
  getSession,
  hashPassword,
  verifyPassword,
  DEMO_ADMIN_ID,
  getDemoAdminEmails,
  isDemoAdminCredentials,
} from "@/lib/auth";
import type { SessionUser } from "@/types/database";

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    return await getSession();
  } catch {
    return null;
  }
}

export async function isDemoModeActive(): Promise<boolean> {
  return isDemoMode();
}

export async function signIn(formData: FormData) {
  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || "/";

  if (isDemoMode()) {
    if (isDemoAdminCredentials(email, password)) {
      const sessionError = await createSession({
        id: DEMO_ADMIN_ID,
        email,
        fullName: "Warehouse Admin",
        isAdmin: true,
      });
      if (sessionError?.error) return sessionError;
      redirect(redirectTo);
    }
    return {
      error: `Invalid credentials. Demo mode: sign in with ${getDemoAdminEmails()[0]} / your configured admin password.`,
    };
  }

  const { rows } = await sql`
    SELECT id, email, password_hash, full_name, is_admin
    FROM users WHERE email = ${email}
  `;

  const user = rows[0];
  if (!user || !(await verifyPassword(password, user.password_hash as string))) {
    return { error: "Invalid email or password" };
  }

  const sessionError = await createSession({
    id: user.id as string,
    email: user.email as string,
    fullName: user.full_name as string | null,
    isAdmin: Boolean(user.is_admin),
  });
  if (sessionError?.error) return sessionError;

  redirect(redirectTo);
}

export async function signUp(formData: FormData) {
  if (isDemoMode()) {
    return {
      error:
        "Staff registration requires a database. Set POSTGRES_URL in .env.local, or sign in with demo admin credentials.",
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
  const sessionError = await createSession({
    id: user.id as string,
    email: user.email as string,
    fullName: user.full_name as string | null,
    isAdmin: Boolean(user.is_admin),
  });
  if (sessionError?.error) return sessionError;

  redirect("/");
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}
