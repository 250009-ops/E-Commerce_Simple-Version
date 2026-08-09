import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";
import { isDemoMode } from "@/lib/db";
import type { SessionUser } from "@/types/database";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const DEV_FALLBACK_SECRET = "dev-secret-change-in-production";
const DEMO_FALLBACK_SECRET = "demo-auth-secret-warehouse-cp";

type SessionPayload = {
  userId: string;
  email: string;
  isAdmin: boolean;
};

export function isAuthConfigured(): boolean {
  return Boolean(process.env.AUTH_SECRET?.trim());
}

export function getAuthSetupMessage(): string | null {
  if (isAuthConfigured()) return null;
  if (process.env.NODE_ENV !== "production" || isDemoMode()) return null;
  return "AUTH_SECRET is required for sign-in in production. Add it in your Vercel project settings under Environment Variables.";
}

function getAuthSecret(): Uint8Array {
  const configured = process.env.AUTH_SECRET?.trim();
  if (configured) {
    return new TextEncoder().encode(configured);
  }

  if (process.env.NODE_ENV !== "production" || isDemoMode()) {
    return new TextEncoder().encode(
      isDemoMode() ? DEMO_FALLBACK_SECRET : DEV_FALLBACK_SECRET
    );
  }

  // Production with a database but no AUTH_SECRET: allow page render and token
  // verification without throwing; block new sessions in createSession.
  return new TextEncoder().encode(DEMO_FALLBACK_SECRET);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(
  user: SessionUser
): Promise<{ error: string } | void> {
  const setupMessage = getAuthSetupMessage();
  if (setupMessage) {
    return { error: setupMessage };
  }

  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
  } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getAuthSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      isAdmin: Boolean(payload.isAdmin),
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return {
    id: payload.userId,
    email: payload.email,
    fullName: null,
    isAdmin: payload.isAdmin,
  };
}

export async function getSessionFromRequest(
  request: NextRequest
): Promise<SessionUser | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return {
    id: payload.userId,
    email: payload.email,
    fullName: null,
    isAdmin: payload.isAdmin,
  };
}

export const DEMO_ADMIN_ID = "demo-admin";

export function getDefaultAdminEmail(): string {
  return process.env.ADMIN_EMAIL ?? "admin@store.com";
}

export function getDemoAdminEmails(): string[] {
  const primary = getDefaultAdminEmail().toLowerCase();
  const aliases = ["admin@store.com", "admin@warehouse.com"];
  return [...new Set([primary, ...aliases])];
}

export function isDemoAdminCredentials(
  email: string,
  password: string
): boolean {
  return (
    getDemoAdminEmails().includes(email.trim().toLowerCase()) &&
    password === getDefaultAdminPassword()
  );
}

export function getDefaultAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "Admin123!";
}
