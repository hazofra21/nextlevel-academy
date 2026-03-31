"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminContext } from "@/auth/user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { auditLog } from "@/security/audit";
import {
  profileRoleSchema,
  profileStatusSchema,
} from "@/security/validation/profile-admin";

function getReturnPath(formData: FormData) {
  const returnTo = String(formData.get("returnTo") ?? "").trim();

  return returnTo.startsWith("/admin/alumnos")
    ? returnTo
    : "/admin/alumnos";
}

async function assertAdminAccess() {
  return requireAdminContext();
}

async function getProfileAdminState(profileId: string) {
  const supabase = createAdminSupabaseClient();
  const [{ data: targetProfile, error: targetError }, { count, error: countError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id,rol,activo")
        .eq("id", profileId)
        .maybeSingle<{ id: string; rol: string; activo: boolean }>(),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .in("rol", ["admin", "superadmin"])
        .eq("activo", true),
    ]);

  if (targetError) {
    throw targetError;
  }

  if (countError) {
    throw countError;
  }

  return {
    targetProfile,
    activeAdminCount: count ?? 0,
  };
}

export async function updateProfileRoleAction(formData: FormData) {
  const actor = await assertAdminAccess();

  const returnPath = getReturnPath(formData);
  const parsed = profileRoleSchema.safeParse({
    profileId: formData.get("profileId"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    redirect(`${returnPath}?error=role`);
  }

  if (actor?.profile.id === parsed.data.profileId) {
    redirect(`${returnPath}?error=self-role`);
  }

  try {
    const { targetProfile, activeAdminCount } = await getProfileAdminState(
      parsed.data.profileId
    );

    if (!targetProfile) {
      redirect(`${returnPath}?error=role`);
    }

    if (
      (targetProfile.rol === "admin" || targetProfile.rol === "superadmin") &&
      parsed.data.role === "alumno" &&
      targetProfile.activo &&
      activeAdminCount <= 1
    ) {
      redirect(`${returnPath}?error=last-admin`);
    }

    const supabase = createAdminSupabaseClient();
    const { error } = await supabase
      .from("profiles")
      .update({ rol: parsed.data.role })
      .eq("id", parsed.data.profileId);

    if (error) {
      throw error;
    }

    auditLog({
      event: "admin_profile_role_updated",
      status: "success",
      actorId: actor.profile.id,
      route: "/admin/alumnos",
      metadata: parsed.data,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/alumnos");
    redirect(`${returnPath}?saved=1`);
  } catch {
    auditLog({
      event: "admin_profile_role_update_failed",
      status: "failure",
      actorId: actor.profile.id,
      route: "/admin/alumnos",
      metadata: {
        profileId: parsed.data.profileId,
      },
    });
    redirect(`${returnPath}?error=role`);
  }
}

export async function updateProfileStatusAction(formData: FormData) {
  const actor = await assertAdminAccess();

  const returnPath = getReturnPath(formData);
  const parsed = profileStatusSchema.safeParse({
    profileId: formData.get("profileId"),
    active: formData.get("active"),
  });

  if (!parsed.success) {
    redirect(`${returnPath}?error=status`);
  }

  if (actor?.profile.id === parsed.data.profileId && !parsed.data.active) {
    redirect(`${returnPath}?error=self-status`);
  }

  try {
    const { targetProfile, activeAdminCount } = await getProfileAdminState(
      parsed.data.profileId
    );

    if (!targetProfile) {
      redirect(`${returnPath}?error=status`);
    }

    if (
      (targetProfile.rol === "admin" || targetProfile.rol === "superadmin") &&
      targetProfile.activo &&
      !parsed.data.active &&
      activeAdminCount <= 1
    ) {
      redirect(`${returnPath}?error=last-admin`);
    }

    const supabase = createAdminSupabaseClient();
    const { error } = await supabase
      .from("profiles")
      .update({ activo: parsed.data.active })
      .eq("id", parsed.data.profileId);

    if (error) {
      throw error;
    }

    auditLog({
      event: "admin_profile_status_updated",
      status: "success",
      actorId: actor.profile.id,
      route: "/admin/alumnos",
      metadata: parsed.data,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/alumnos");
    redirect(`${returnPath}?saved=1`);
  } catch {
    auditLog({
      event: "admin_profile_status_update_failed",
      status: "failure",
      actorId: actor.profile.id,
      route: "/admin/alumnos",
      metadata: {
        profileId: parsed.data.profileId,
      },
    });
    redirect(`${returnPath}?error=status`);
  }
}
