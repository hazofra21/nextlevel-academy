import "server-only";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export type AppRole = "user" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  foto_url: string | null;
  rol: string;
  activo: boolean;
}

export interface CurrentUserContext {
  user: User;
  profile: UserProfile;
  role: AppRole;
}

function normalizeRole(role: string | null | undefined): AppRole {
  if (role === "admin" || role === "superadmin") {
    return "admin";
  }

  return "user";
}

function getFirstString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function splitFullName(user: User) {
  const metadata = user.user_metadata ?? {};
  const givenName =
    getFirstString(metadata.given_name) ??
    getFirstString(metadata.first_name);
  const familyName =
    getFirstString(metadata.family_name) ??
    getFirstString(metadata.last_name);

  if (givenName || familyName) {
    return {
      nombre: givenName ?? "Jugador",
      apellidos: familyName ?? "NextLevel",
    };
  }

  const fullName =
    getFirstString(metadata.full_name) ??
    getFirstString(metadata.name) ??
    getFirstString(user.email?.split("@")[0]);

  if (!fullName) {
    return {
      nombre: "Jugador",
      apellidos: "NextLevel",
    };
  }

  const parts = fullName.split(/\s+/).filter(Boolean);
  const nombre = parts.shift() ?? "Jugador";
  const apellidos = parts.join(" ") || "NextLevel";

  return { nombre, apellidos };
}

function buildProfilePayload(user: User) {
  const email = user.email?.trim();

  if (!email) {
    throw new Error("Authenticated user is missing a valid email");
  }

  const { nombre, apellidos } = splitFullName(user);
  const metadata = user.user_metadata ?? {};
  const fotoUrl =
    getFirstString(metadata.avatar_url) ?? getFirstString(metadata.picture);

  return {
    id: user.id,
    email,
    nombre,
    apellidos,
    foto_url: fotoUrl,
  };
}

async function getProfileById(userId: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,nombre,apellidos,foto_url,rol,activo")
    .eq("id", userId)
    .maybeSingle<UserProfile>();

  if (error) {
    throw error;
  }

  return data ?? null;
}

export async function syncUserProfile(user: User) {
  const payload = buildProfilePayload(user);
  const supabase = createAdminSupabaseClient();
  const existingProfile = await getProfileById(user.id);

  if (existingProfile) {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        email: payload.email,
        nombre: payload.nombre,
        apellidos: payload.apellidos,
        foto_url: payload.foto_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select("id,email,nombre,apellidos,foto_url,rol,activo")
      .single<UserProfile>();

    if (error) {
      throw error;
    }

    return data;
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      ...payload,
      rol: "alumno",
      activo: true,
    })
    .select("id,email,nombre,apellidos,foto_url,rol,activo")
    .single<UserProfile>();

  if (error) {
    throw error;
  }

  return data;
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user ?? null;
}

export async function getCurrentUserContext() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  let profile = await getProfileById(user.id);

  if (!profile) {
    profile = await syncUserProfile(user);
  }

  return {
    user,
    profile,
    role: normalizeRole(profile.rol),
  } satisfies CurrentUserContext;
}

export async function requireUserContext() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect("/login");
  }

  if (!context.profile.activo) {
    redirect("/auth/logout?reason=inactive");
  }

  return context;
}

export async function requireRole(role: AppRole) {
  const context = await requireUserContext();

  if (context.role !== role) {
    redirect("/dashboard?forbidden=1");
  }

  return context;
}

export async function requireAdminContext() {
  return requireRole("admin");
}
