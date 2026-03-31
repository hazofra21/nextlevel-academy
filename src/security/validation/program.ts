import { z } from "zod";

const optionalTrimmedString = z
  .string()
  .trim()
  .max(5000)
  .transform((value) => (value === "" ? null : value))
  .nullable();

const requiredString = (max: number) =>
  z.string().trim().min(1).max(max);

const optionalNumberString = z
  .string()
  .trim()
  .transform((value) => {
    if (!value) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : NaN;
  })
  .nullable()
  .refine((value) => value === null || !Number.isNaN(value), "Invalid number");

const multilineList = z
  .string()
  .default("")
  .transform((value) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
  );

const booleanCheckbox = z
  .union([z.literal("on"), z.undefined(), z.null()])
  .transform((value) => value === "on");

export const programCampaignSchema = z
  .object({
    id: z.string().trim().optional().default(""),
    tipo: z.enum(["campamento", "tecnificacion", "clinica"]),
    slug: z
      .string()
      .trim()
      .min(3)
      .max(120)
      .regex(/^[a-z0-9-]+$/, "Invalid slug"),
    titulo: requiredString(160),
    descripcion: requiredString(5000),
    descripcion_corta: z
      .string()
      .trim()
      .max(300)
      .transform((value) => (value === "" ? null : value)),
    imagen_portada: z
      .string()
      .trim()
      .max(2048)
      .transform((value) => (value === "" ? null : value)),
    fecha_inicio: z.string().trim().min(1),
    fecha_fin: z.string().trim().optional().default(""),
    hora_inicio: z
      .string()
      .trim()
      .max(10)
      .transform((value) => (value === "" ? null : value)),
    hora_fin: z
      .string()
      .trim()
      .max(10)
      .transform((value) => (value === "" ? null : value)),
    ubicacion: requiredString(160),
    ciudad: z
      .string()
      .trim()
      .max(120)
      .transform((value) => (value === "" ? null : value)),
    plazas_totales: optionalNumberString,
    precio: optionalNumberString,
    edad_minima: optionalNumberString,
    edad_maxima: optionalNumberString,
    incluye: multilineList,
    requisitos: multilineList,
    registration_url: z
      .string()
      .trim()
      .max(2048)
      .transform((value) => (value === "" ? null : value)),
    contact_phone: z
      .string()
      .trim()
      .max(60)
      .transform((value) => (value === "" ? null : value)),
    contact_email: z
      .string()
      .trim()
      .max(320)
      .transform((value) => (value === "" ? null : value))
      .refine(
        (value) => value === null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        "Invalid email"
      ),
    publicado: booleanCheckbox,
    destacado: booleanCheckbox,
    popup_enabled: booleanCheckbox,
    banner_enabled: booleanCheckbox,
  })
  .superRefine((data, ctx) => {
    if (data.fecha_fin && data.fecha_fin < data.fecha_inicio) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be on or after start date",
        path: ["fecha_fin"],
      });
    }

    if (
      data.edad_minima !== null &&
      data.edad_maxima !== null &&
      data.edad_maxima < data.edad_minima
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Maximum age must be greater than minimum age",
        path: ["edad_maxima"],
      });
    }
  });

export type ProgramCampaignInput = z.infer<typeof programCampaignSchema>;
