export function hasSupabaseSessionCookie(cookieNames: string[]) {
  return cookieNames.some(
    (name) =>
      name.startsWith("sb-") ||
      name.startsWith("supabase-auth-token")
  );
}
