"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminContext } from "@/auth/user";
import { auditLog } from "@/security/audit";
import { leadStatusSchema } from "@/security/validation/lead";
import { updateLeadStatus } from "@/lib/leads";

function getReturnPath(formData: FormData) {
  const returnTo = String(formData.get("returnTo") ?? "").trim();

  if (returnTo.startsWith("/admin/contactos")) {
    return returnTo;
  }

  return "/admin/contactos";
}

export async function updateLeadStatusAction(formData: FormData) {
  const admin = await requireAdminContext();
  const returnPath = getReturnPath(formData);

  const parsed = leadStatusSchema.safeParse({
    leadId: formData.get("leadId"),
    estado: formData.get("estado"),
    returnTo: formData.get("returnTo"),
  });

  if (!parsed.success) {
    redirect(`${returnPath}${returnPath.includes("?") ? "&" : "?"}error=validation`);
  }

  try {
    await updateLeadStatus({
      leadId: parsed.data.leadId,
      estado: parsed.data.estado,
    });

    auditLog({
      event: "admin_lead_status_updated",
      status: "success",
      actorId: admin.profile.id,
      route: "/admin/contactos",
      metadata: {
        leadId: parsed.data.leadId,
        estado: parsed.data.estado,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/contactos");
    redirect(`${returnPath}${returnPath.includes("?") ? "&" : "?"}saved=1`);
  } catch (error) {
    auditLog({
      event: "admin_lead_status_failed",
      status: "failure",
      actorId: admin.profile.id,
      route: "/admin/contactos",
      metadata: {
        reason: error instanceof Error ? error.name : "unknown",
      },
    });
    redirect(`${returnPath}${returnPath.includes("?") ? "&" : "?"}error=save`);
  }
}
