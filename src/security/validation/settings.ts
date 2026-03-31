import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => value || null);

const optionalUrl = z
  .union([z.literal(""), z.string().trim().url("URL inválida")])
  .transform((value) => value || null);

const optionalEmail = z
  .union([z.literal(""), z.string().trim().email("Email inválido")])
  .transform((value) => value || null);

export const academySettingsSchema = z.object({
  nombre_academia: z.string().trim().min(2).max(120),
  email_contacto: optionalEmail,
  telefono: optionalText,
  direccion: optionalText,
  instagram: optionalUrl,
  telegram: optionalUrl,
  youtube: optionalUrl,
  email_notificaciones: optionalEmail,
  politica_privacidad: optionalText,
  terminos_condiciones: optionalText,
  politica_cookies: optionalText,
});

export type AcademySettingsInput = z.infer<typeof academySettingsSchema>;
