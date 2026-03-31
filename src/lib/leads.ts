import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface LeadRecord {
  id: string;
  user_id: string | null;
  nombre: string;
  email: string;
  telefono: string | null;
  asunto: string | null;
  mensaje: string;
  origen: string;
  estado: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface LeadOptions {
  status?: string;
  query?: string;
}

function isLeadsTableMissing(error: unknown) {
  const message =
    error instanceof Error ? error.message : String(error ?? "").toLowerCase();

  return message.toLowerCase().includes("leads");
}

export async function getLeadsForAdmin(options: LeadOptions = {}) {
  const supabase = createAdminSupabaseClient();
  let query = supabase
    .from("leads")
    .select(
      "id,user_id,nombre,email,telefono,asunto,mensaje,origen,estado,metadata,created_at,updated_at"
    )
    .order("created_at", { ascending: false });

  if (options.status) {
    query = query.eq("estado", options.status);
  }

  if (options.query) {
    const safeQuery = options.query.replace(/[%_]/g, "").trim();

    if (safeQuery.length > 0) {
      query = query.or(
        `nombre.ilike.%${safeQuery}%,email.ilike.%${safeQuery}%,asunto.ilike.%${safeQuery}%`
      );
    }
  }

  const { data, error } = await query;

  if (error) {
    if (isLeadsTableMissing(error)) {
      return {
        available: false,
        leads: [] as LeadRecord[],
      };
    }

    throw error;
  }

  return {
    available: true,
    leads: (data ?? []) as LeadRecord[],
  };
}

export async function createLead(input: {
  userId?: string | null;
  nombre: string;
  email: string;
  telefono?: string | null;
  asunto?: string | null;
  mensaje: string;
  origen?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = createAdminSupabaseClient();
  const payload = {
    user_id: input.userId ?? null,
    nombre: input.nombre,
    email: input.email,
    telefono: input.telefono ?? null,
    asunto: input.asunto ?? null,
    mensaje: input.mensaje,
    origen: input.origen ?? "contacto_web",
    metadata: input.metadata ?? {},
  };

  const { data, error } = await supabase
    .from("leads")
    .insert(payload)
    .select(
      "id,user_id,nombre,email,telefono,asunto,mensaje,origen,estado,metadata,created_at,updated_at"
    )
    .single();

  if (error) {
    if (isLeadsTableMissing(error)) {
      const customError = new Error("Leads table missing");
      customError.name = "LeadsTableMissing";
      throw customError;
    }

    throw error;
  }

  return data as LeadRecord;
}

export async function updateLeadStatus(input: {
  leadId: string;
  estado: "nuevo" | "contactado" | "cerrado" | "spam";
}) {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("leads")
    .update({
      estado: input.estado,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.leadId);

  if (error) {
    if (isLeadsTableMissing(error)) {
      const customError = new Error("Leads table missing");
      customError.name = "LeadsTableMissing";
      throw customError;
    }

    throw error;
  }
}
