import { createClient } from "@/lib/supabase/server";
import { syncUserProfile } from "@/auth/user";
import { auditLog } from "@/security/audit";
import { getClientIp } from "@/security/ip";
import { NextResponse } from "next/server";

function getSafeNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/")) {
    return "/dashboard";
  }

  if (nextPath.startsWith("//")) {
    return "/dashboard";
  }

  return nextPath;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeNextPath(searchParams.get("next"));
  const ip = getClientIp(request.headers);

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      try {
        if (data.user) {
          const profile = await syncUserProfile(data.user);

          if (!profile.activo) {
            await supabase.auth.signOut();
            auditLog({
              event: "user_oauth_login_inactive",
              status: "failure",
              actorId: data.user.id,
              ip,
              route: "/auth/callback",
            });

            return NextResponse.redirect(`${origin}/login?error=inactive`);
          }
        }

        auditLog({
          event: "user_oauth_login_success",
          status: "success",
          actorId: data.user?.id ?? null,
          ip,
          route: "/auth/callback",
        });

        return NextResponse.redirect(`${origin}${next}`);
      } catch {
        await supabase.auth.signOut();
      }
    }

    auditLog({
      event: "user_oauth_login_failed",
      status: "failure",
      ip,
      route: "/auth/callback",
      metadata: {
        hasCode: true,
      },
    });

    if (!error) {
      return NextResponse.redirect(`${origin}/login?error=profile`);
    }

    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  auditLog({
    event: "user_oauth_login_failed",
    status: "failure",
    ip,
    route: "/auth/callback",
    metadata: {
      hasCode: false,
    },
  });

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
