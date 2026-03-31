import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface AcademySettingsRecord {
  id: number;
  nombre_academia: string;
  email_contacto: string | null;
  telefono: string | null;
  direccion: string | null;
  redes_sociales: {
    instagram?: string;
    telegram?: string;
    youtube?: string;
  } | null;
  email_notificaciones: string | null;
  politica_privacidad: string | null;
  terminos_condiciones: string | null;
  politica_cookies: string | null;
  updated_at: string | null;
}

export async function getAcademySettings() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("configuracion")
    .select(
      "id,nombre_academia,email_contacto,telefono,direccion,redes_sociales,email_notificaciones,politica_privacidad,terminos_condiciones,politica_cookies,updated_at"
    )
    .eq("id", 1)
    .single();

  if (error) {
    throw error;
  }

  return data as AcademySettingsRecord;
}
