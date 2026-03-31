import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

interface CheckoutResource {
  id: string;
  type: "program" | "course";
  title: string;
  price: number;
  published: boolean;
}

export async function getCheckoutResource(input: {
  resourceType: "program" | "course";
  resourceId: string;
}) {
  const supabase = createAdminSupabaseClient();

  if (input.resourceType === "program") {
    const { data, error } = await supabase
      .from("programas")
      .select("id,titulo,precio,publicado")
      .eq("id", input.resourceId)
      .maybeSingle<{
        id: string;
        titulo: string;
        precio: number | null;
        publicado: boolean | null;
      }>();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      type: "program",
      title: data.titulo,
      price: Number(data.precio ?? 0),
      published: Boolean(data.publicado),
    } satisfies CheckoutResource;
  }

  const { data, error } = await supabase
    .from("cursos")
    .select("id,titulo,precio,publicado")
    .eq("id", input.resourceId)
    .maybeSingle<{
      id: string;
      titulo: string;
      precio: number | null;
      publicado: boolean | null;
    }>();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    type: "course",
    title: data.titulo,
    price: Number(data.precio ?? 0),
    published: Boolean(data.publicado),
  } satisfies CheckoutResource;
}
