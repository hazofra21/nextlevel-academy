import { z } from "zod";

export const checkoutSessionSchema = z.object({
  provider: z.enum(["stripe", "paypal"]),
  resourceType: z.enum(["program", "course"]),
  resourceId: z.string().trim().uuid(),
  quantity: z.coerce.number().int().min(1).max(10).default(1),
});

export type CheckoutSessionInput = z.infer<typeof checkoutSessionSchema>;
