import { NextResponse, type NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

const PROTECTED_PATHS = ["/dispatch", "/movements", "/admin"];

export async function updateSession(request: NextRequest) {
  try {
    const response = NextResponse.next({ request });
    const pathname = request.nextUrl.pathname;

    const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
    if (!isProtected) return response;

    const user = await getSessionFromRequest(request);

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/sign-in";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/admin") && !user.isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return response;
  } catch {
    return NextResponse.next({ request });
  }
}
