import { NextResponse } from "next/server";
import {
  getAdminCookieName,
  getAdminCookieOptions,
} from "@/lib/admin-auth";
import { getClientIp } from "@/security/ip";
import { isTrustedOrigin } from "@/security/request-origin";
import { auditLog } from "@/security/audit";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  if (!isTrustedOrigin(request.headers)) {
    const loginUrlForbidden = new URL("/admin/login?error=origin", request.url);
    auditLog({
      event: "admin_login_origin_rejected",
      status: "failure",
      ip,
      route: "/admin/api/login",
    });

    return NextResponse.redirect(loginUrlForbidden, 303);
  }

  const loginUrl = new URL("/admin/login?error=disabled", request.url);
  const response = NextResponse.redirect(loginUrl, 303);
  response.cookies.set(getAdminCookieName(), "", {
    ...getAdminCookieOptions(),
    maxAge: 0,
  });

  auditLog({
    event: "admin_login_legacy_route_rejected",
    status: "info",
    ip,
    route: "/admin/api/login",
  });

  return response;
}
