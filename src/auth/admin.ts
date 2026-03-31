import "server-only";

import { getCurrentUserContext } from "@/auth/user";

const ADMIN_COOKIE_NAME = "nla_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 2;

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}

export function isTempAdminLoginEnabled() {
  return process.env.ADMIN_TEMP_LOGIN_ENABLED?.trim() === "true";
}

export async function hasAdminRole() {
  const context = await getCurrentUserContext();

  return context?.role === "admin";
}

export async function isAdminAuthenticated() {
  return hasAdminRole();
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
