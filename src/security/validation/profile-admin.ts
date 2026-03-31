import { z } from "zod";

export const profileRoleSchema = z.object({
  profileId: z.string().uuid(),
  role: z.enum(["alumno", "admin"]),
});

export const profileStatusSchema = z.object({
  profileId: z.string().uuid(),
  active: z.enum(["true", "false"]).transform((value) => value === "true"),
});
