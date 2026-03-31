import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface AdminProfileRecord {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  foto_url: string | null;
  rol: string;
  activo: boolean;
  created_at: string | null;
}

interface GetProfilesForAdminOptions {
  role?: string;
  status?: string;
  query?: string;
}

export async function getProfilesForAdmin(
  options: GetProfilesForAdminOptions = {}
) {
  const supabase = createAdminSupabaseClient();
  let query = supabase
    .from("profiles")
    .select("id,email,nombre,apellidos,foto_url,rol,activo,created_at")
    .order("created_at", { ascending: false });

  if (options.role === "admin") {
    query = query.in("rol", ["admin", "superadmin"]);
  }

  if (options.role === "alumno") {
    query = query.eq("rol", "alumno");
  }

  if (options.status === "active") {
    query = query.eq("activo", true);
  }

  if (options.status === "inactive") {
    query = query.eq("activo", false);
  }

  if (options.query) {
    const safeQuery = options.query.replace(/[%_]/g, "").trim();

    if (safeQuery.length > 0) {
      query = query.or(
        `email.ilike.%${safeQuery}%,nombre.ilike.%${safeQuery}%,apellidos.ilike.%${safeQuery}%`
      );
    }
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminProfileRecord[];
}
