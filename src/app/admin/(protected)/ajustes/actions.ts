"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminContext } from "@/auth/user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { auditLog } from "@/security/audit";
import {
  academySettingsSchema,
  type AcademySettingsInput,
} from "@/security/validation/settings";

function parseSettingsFormData(formData: FormData): AcademySettingsInput {
  const rawPayload = {
    nombre_academia: formData.get("nombre_academia"),
    email_contacto: formData.get("email_contacto"),
    telefono: formData.get("telefono"),
    direccion: formData.get("direccion"),
    instagram: formData.get("instagram"),
    telegram: formData.get("telegram"),
    youtube: formData.get("youtube"),
    email_notificaciones: formData.get("email_notificaciones"),
    politica_privacidad: formData.get("politica_privacidad"),
    terminos_condiciones: formData.get("terminos_condiciones"),
    politica_cookies: formData.get("politica_cookies"),
  };

  const parsed = academySettingsSchema.safeParse(rawPayload);

  if (!parsed.success) {
    throw new Error("Invalid academy settings payload");
  }

  return parsed.data;
}

export async function saveAcademySettingsAction(formData: FormData) {
  const admin = await requireAdminContext();

  try {
    const validated = parseSettingsFormData(formData);
    const supabase = createAdminSupabaseClient();
    const payload = {
      id: 1,
      nombre_academia: validated.nombre_academia,
      email_contacto: validated.email_contacto,
      telefono: validated.telefono,
      direccion: validated.direccion,
      redes_sociales: {
        instagram: validated.instagram ?? "",
        telegram: validated.telegram ?? "",
        youtube: validated.youtube ?? "",
      },
      email_notificaciones: validated.email_notificaciones,
      politica_privacidad: validated.politica_privacidad,
      terminos_condiciones: validated.terminos_condiciones,
      politica_cookies: validated.politica_cookies,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("configuracion")
      .upsert(payload, { onConflict: "id" });

    if (error) throw error;

    auditLog({
      event: "admin_settings_saved",
      status: "success",
      actorId: admin.profile.id,
      route: "/admin/ajustes",
    });

    revalidatePath("/");
    revalidatePath("/contacto");
    revalidatePath("/privacidad");
    revalidatePath("/terminos");
    revalidatePath("/cookies");
    revalidatePath("/admin");
    revalidatePath("/admin/ajustes");

    redirect("/admin/ajustes?saved=1");
  } catch {
    auditLog({
      event: "admin_settings_save_failed",
      status: "failure",
      actorId: admin.profile.id,
      route: "/admin/ajustes",
    });
    redirect("/admin/ajustes?error=save");
  }
}
