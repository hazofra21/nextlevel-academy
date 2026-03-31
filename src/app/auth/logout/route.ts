import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getClientIp } from "@/security/ip";
import { isTrustedOrigin } from "@/security/request-origin";
import { auditLog } from "@/security/audit";

async function performLogout(request: Request) {
  const ip = getClientIp(request.headers);
  const url = new URL(request.url);
  const reason = url.searchParams.get("reason")?.trim();

  if (!isTrustedOrigin(request.headers)) {
    auditLog({
      event: "user_logout_origin_rejected",
      status: "failure",
      ip,
      route: "/auth/logout",
    });

    return NextResponse.redirect(new URL("/dashboard", request.url), 303);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.auth.signOut();

  auditLog({
    event: "user_logout",
    status: "info",
    actorId: user?.id ?? null,
    ip,
    route: "/auth/logout",
    metadata: {
      reason: reason || undefined,
    },
  });

  const nextUrl = new URL("/login", request.url);

  if (reason === "inactive") {
    nextUrl.searchParams.set("error", "inactive");
  }

  return NextResponse.redirect(nextUrl, 303);
}

export async function POST(request: Request) {
  return performLogout(request);
}

export async function GET(request: Request) {
  return performLogout(request);
}
