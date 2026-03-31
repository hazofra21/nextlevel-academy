import { z } from "zod";

const credentialField = z
  .string()
  .trim()
  .min(1, "Required")
  .max(128, "Too long");

export const adminLoginSchema = z.object({
  username: credentialField,
  password: credentialField,
});
