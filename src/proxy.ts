import { NextResponse, type NextRequest } from "next/server";
import {
  hasSupabaseSessionCookie,
} from "@/auth/admin-edge";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/api/login"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const cookieNames = request.cookies.getAll().map((cookie) => cookie.name);

  if (hasSupabaseSessionCookie(cookieNames)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
