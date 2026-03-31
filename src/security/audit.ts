import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

interface AuditPayload {
  event: string;
  status: "success" | "failure" | "info";
  actorId?: string | null;
  ip?: string | null;
  route?: string | null;
  metadata?: Record<string, unknown>;
}

interface AuditLogRecord {
  id: string;
  created_at: string;
  event: string;
  status: "success" | "failure" | "info";
  actor_id: string | null;
  ip: string | null;
  route: string | null;
  metadata: Record<string, unknown> | null;
}

let auditPersistenceUnavailableLogged = false;

function normalizeActorId(actorId: string | null | undefined) {
  if (!actorId) return null;

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    actorId
  )
    ? actorId
    : null;
}

function buildAuditEntry(payload: AuditPayload) {
  return {
    ts: new Date().toISOString(),
    ...payload,
  };
}

async function persistAuditEntry(entry: ReturnType<typeof buildAuditEntry>) {
  try {
    const supabase = createAdminSupabaseClient();
    const { error } = await supabase.from("audit_logs").insert({
      created_at: entry.ts,
      event: entry.event,
      status: entry.status,
      actor_id: normalizeActorId(entry.actorId),
      ip: entry.ip ?? null,
      route: entry.route ?? null,
      metadata: {
        ...(entry.metadata ?? {}),
        actorLabel:
          entry.actorId && !normalizeActorId(entry.actorId)
            ? entry.actorId
            : undefined,
      },
    });

    if (error && !auditPersistenceUnavailableLogged) {
      auditPersistenceUnavailableLogged = true;
      console.warn("[audit] persistence unavailable", error.message);
    }
  } catch (error) {
    if (!auditPersistenceUnavailableLogged) {
      auditPersistenceUnavailableLogged = true;
      console.warn(
        "[audit] persistence unavailable",
        error instanceof Error ? error.message : "unknown"
      );
    }
  }
}

export function auditLog(payload: AuditPayload) {
  const entry = buildAuditEntry(payload);

  console.info("[audit]", JSON.stringify(entry));
  void persistAuditEntry(entry);
}

export async function getRecentAuditLogs(limit = 50) {
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("audit_logs")
      .select("id,created_at,event,status,actor_id,ip,route,metadata")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return {
        available: false,
        records: [] as AuditLogRecord[],
      };
    }

    return {
      available: true,
      records: (data ?? []) as AuditLogRecord[],
    };
  } catch {
    return {
      available: false,
      records: [] as AuditLogRecord[],
    };
  }
}
