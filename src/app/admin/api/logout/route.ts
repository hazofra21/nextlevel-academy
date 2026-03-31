import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminCookieName, getAdminCookieOptions } from "@/lib/admin-auth";
import { getClientIp } from "@/security/ip";
import { isTrustedOrigin } from "@/security/request-origin";
import { auditLog } from "@/security/audit";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  if (!isTrustedOrigin(request.headers)) {
    auditLog({
      event: "admin_logout_origin_rejected",
      status: "failure",
      ip,
      route: "/admin/api/logout",
    });

    return NextResponse.redirect(new URL("/admin", request.url), 303);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  auditLog({
    event: "admin_logout",
    status: "info",
    actorId: user?.id ?? null,
    ip,
    route: "/admin/api/logout",
  });

  response.cookies.set(getAdminCookieName(), "", {
    ...getAdminCookieOptions(),
    maxAge: 0,
  });

  return response;
}
