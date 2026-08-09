import { NextResponse, type NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const protectedPaths = ["/checkout", "/orders", "/admin"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isDatabaseConfigured()) {
    if (isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/sign-in";
      url.searchParams.set(
        "message",
        "Database is not configured. Set POSTGRES_URL and AUTH_SECRET to use checkout, orders, and admin."
      );
      return NextResponse.redirect(url);
    }
    return response;
  }

  const user = await getSessionFromRequest(request);

  if (
    !user &&
    (request.nextUrl.pathname.startsWith("/checkout") ||
      request.nextUrl.pathname.startsWith("/orders") ||
      request.nextUrl.pathname.startsWith("/admin"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (request.nextUrl.pathname.startsWith("/admin") && user && !user.isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}
