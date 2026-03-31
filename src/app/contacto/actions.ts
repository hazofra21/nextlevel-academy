"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auditLog } from "@/security/audit";
import { getClientIp } from "@/security/ip";
import { consumeRateLimit } from "@/security/rate-limit";
import { isTrustedOrigin } from "@/security/request-origin";
import { publicLeadSchema } from "@/security/validation/lead";
import { createLead } from "@/lib/leads";
import { getCurrentUser } from "@/auth/user";

function getReturnQuery(status: string) {
  return `/contacto?${status}=1`;
}

export async function submitContactLeadAction(formData: FormData) {
  const headersStore = await headers();
  const ip = getClientIp(headersStore);

  if (!isTrustedOrigin(headersStore)) {
    auditLog({
      event: "contact_lead_origin_rejected",
      status: "failure",
      ip,
      route: "/contacto",
    });
    redirect(getReturnQuery("error"));
  }

  const rateLimit = await consumeRateLimit({
    key: `contact:${ip}`,
    windowMs: 10 * 60 * 1000,
    max: 5,
  });

  if (!rateLimit.ok) {
    auditLog({
      event: "contact_lead_rate_limited",
      status: "failure",
      ip,
      route: "/contacto",
    });
    redirect(getReturnQuery("limited"));
  }

  const parsed = publicLeadSchema.safeParse({
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    telefono: formData.get("telefono"),
    asunto: formData.get("asunto"),
    mensaje: formData.get("mensaje"),
  });

  if (!parsed.success) {
    auditLog({
      event: "contact_lead_invalid",
      status: "failure",
      ip,
      route: "/contacto",
    });
    redirect(getReturnQuery("error"));
  }

  const website = String(formData.get("website") ?? "").trim();
  const startedAt = Number(formData.get("started_at") ?? "0");

  if (website.length > 0 || !Number.isFinite(startedAt) || Date.now() - startedAt < 1500) {
    auditLog({
      event: "contact_lead_bot_rejected",
      status: "failure",
      ip,
      route: "/contacto",
    });
    redirect(getReturnQuery("limited"));
  }

  try {
    const user = await getCurrentUser();

    await createLead({
      userId: user?.id ?? null,
      nombre: parsed.data.nombre,
      email: parsed.data.email,
      telefono: parsed.data.telefono,
      asunto: parsed.data.asunto,
      mensaje: parsed.data.mensaje,
      origen: "contacto_web",
      metadata: {
        ip,
      },
    });

    auditLog({
      event: "contact_lead_created",
      status: "success",
      actorId: user?.id ?? null,
      ip,
      route: "/contacto",
    });

    redirect(getReturnQuery("sent"));
  } catch (error) {
    auditLog({
      event: "contact_lead_failed",
      status: "failure",
      actorId: null,
      ip,
      route: "/contacto",
      metadata: {
        reason: error instanceof Error ? error.name : "unknown",
      },
    });

    if (error instanceof Error && error.name === "LeadsTableMissing") {
      redirect(getReturnQuery("schema"));
    }

    redirect(getReturnQuery("error"));
  }
}
