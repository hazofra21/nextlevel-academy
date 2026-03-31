import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => value || null);

export const publicLeadSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  telefono: optionalText,
  asunto: optionalText,
  mensaje: z.string().trim().min(10).max(4000),
});

export const leadStatusSchema = z.object({
  leadId: z.string().trim().uuid(),
  estado: z.enum(["nuevo", "contactado", "cerrado", "spam"]),
  returnTo: z.string().trim().optional(),
});

export type PublicLeadInput = z.infer<typeof publicLeadSchema>;
