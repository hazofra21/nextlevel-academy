"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminContext } from "@/auth/user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { auditLog } from "@/security/audit";
import {
  programCampaignSchema,
  type ProgramCampaignInput,
} from "@/security/validation/program";

async function ensureCampaignAssetsBucket() {
  const supabase = createAdminSupabaseClient();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    throw listError;
  }

  const existingBucket = buckets.find((bucket) => bucket.name === "campaign-assets");

  if (!existingBucket) {
    const { error: createError } = await supabase.storage.createBucket(
      "campaign-assets",
      {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024,
      }
    );

    if (createError) {
      throw createError;
    }
  }
}

async function uploadPosterIfPresent(formData: FormData, slug: string) {
  const file = formData.get("poster_file");

  if (!(file instanceof File) || file.size === 0) {
    return String(formData.get("imagen_portada") ?? "").trim() || null;
  }

  const allowedMimeTypes = new Set([
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/avif",
  ]);

  if (!allowedMimeTypes.has(file.type) || file.size > 5 * 1024 * 1024) {
    throw new Error("Invalid poster file");
  }

  await ensureCampaignAssetsBucket();

  const supabase = createAdminSupabaseClient();
  const extension = file.name.split(".").pop() || "webp";
  const filePath = `${slug}-${Date.now()}.${extension}`;
  const arrayBuffer = await file.arrayBuffer();
  const contentType = file.type || "application/octet-stream";

  const { error: uploadError } = await supabase.storage
    .from("campaign-assets")
    .upload(filePath, Buffer.from(arrayBuffer), {
      cacheControl: "3600",
      upsert: true,
      contentType,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("campaign-assets")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

function parseProgramFormData(formData: FormData): ProgramCampaignInput {
  const rawPayload = {
    id: formData.get("id"),
    tipo: formData.get("tipo"),
    slug: formData.get("slug"),
    titulo: formData.get("titulo"),
    descripcion: formData.get("descripcion"),
    descripcion_corta: formData.get("descripcion_corta"),
    imagen_portada: formData.get("imagen_portada"),
    fecha_inicio: formData.get("fecha_inicio"),
    fecha_fin: formData.get("fecha_fin"),
    hora_inicio: formData.get("hora_inicio"),
    hora_fin: formData.get("hora_fin"),
    ubicacion: formData.get("ubicacion"),
    ciudad: formData.get("ciudad"),
    plazas_totales: formData.get("plazas_totales"),
    precio: formData.get("precio"),
    edad_minima: formData.get("edad_minima"),
    edad_maxima: formData.get("edad_maxima"),
    incluye: formData.get("incluye"),
    requisitos: formData.get("requisitos"),
    registration_url: formData.get("registration_url"),
    contact_phone: formData.get("contact_phone"),
    contact_email: formData.get("contact_email"),
    publicado: formData.get("publicado"),
    destacado: formData.get("destacado"),
    popup_enabled: formData.get("popup_enabled"),
    banner_enabled: formData.get("banner_enabled"),
  };

  const parsed = programCampaignSchema.safeParse(rawPayload);

  if (!parsed.success) {
    throw new Error("Invalid campaign payload");
  }

  return parsed.data;
}

export async function saveProgramAction(formData: FormData) {
  const admin = await requireAdminContext();

  try {
    const supabase = createAdminSupabaseClient();
    const validated = parseProgramFormData(formData);
    const imageUrl = await uploadPosterIfPresent(formData, validated.slug);
    const payload = {
      id: validated.id || undefined,
      tipo: validated.tipo,
      slug: validated.slug,
      titulo: validated.titulo,
      descripcion: validated.descripcion,
      descripcion_corta: validated.descripcion_corta,
      imagen_portada: imageUrl,
      fecha_inicio: validated.fecha_inicio,
      fecha_fin: validated.fecha_fin || validated.fecha_inicio,
      hora_inicio: validated.hora_inicio,
      hora_fin: validated.hora_fin,
      ubicacion: validated.ubicacion,
      ciudad: validated.ciudad,
      plazas_totales: validated.plazas_totales ?? 0,
      precio: validated.precio ?? 0,
      edad_minima: validated.edad_minima,
      edad_maxima: validated.edad_maxima,
      incluye: validated.incluye,
      requisitos: validated.requisitos,
      publicado: validated.publicado,
      destacado: validated.destacado,
      horario_detalle: {
        registrationUrl: validated.registration_url ?? "",
        contactPhone: validated.contact_phone ?? "",
        contactEmail: validated.contact_email ?? "",
        popupEnabled: validated.popup_enabled,
        bannerEnabled: validated.banner_enabled,
      },
    };

    const { error } = await supabase
      .from("programas")
      .upsert(payload, { onConflict: "slug" });

    if (error) {
      throw error;
    }

    auditLog({
      event: "admin_campaign_saved",
      status: "success",
      actorId: admin.profile.id,
      route: "/admin/eventos",
      metadata: {
        slug: validated.slug,
        published: validated.publicado,
        popupEnabled: validated.popup_enabled,
        bannerEnabled: validated.banner_enabled,
      },
    });

    revalidatePath("/");
    revalidatePath("/campamentos");
    revalidatePath("/admin");
    revalidatePath("/admin/eventos");
    revalidatePath("/admin/publicidad");

    redirect("/admin/eventos?saved=1");
  } catch {
    auditLog({
      event: "admin_campaign_save_failed",
      status: "failure",
      actorId: admin.profile.id,
      route: "/admin/eventos",
    });
    redirect("/admin/eventos?error=save");
  }
}
