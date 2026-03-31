import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

interface PendingOrderInput {
  profileId: string;
  email: string;
  resourceType: "program" | "course";
  resourceId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  currency?: string;
}

function getItemType(resourceType: "program" | "course") {
  return resourceType === "course" ? "curso" : "inscripcion";
}

interface ExistingOrderRow {
  id: string;
  cliente_id: string;
  estado: string;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
}

export async function createPendingOrder(input: PendingOrderInput) {
  const supabase = createAdminSupabaseClient();
  const total = Number((input.unitPrice * input.quantity).toFixed(2));
  const currency = input.currency ?? "EUR";

  const { data: order, error: orderError } = await supabase
    .from("pedidos")
    .insert({
      cliente_id: input.profileId,
      estado: "pendiente",
      subtotal: total,
      descuento_total: 0,
      envio_coste: 0,
      iva_total: 0,
      total,
      moneda: currency,
      envio_email: input.email,
    })
    .select("id,numero_pedido")
    .single<{
      id: string;
      numero_pedido: string;
    }>();

  if (orderError) throw orderError;

  const { error: itemError } = await supabase.from("pedido_items").insert({
    pedido_id: order.id,
    programa_id: input.resourceType === "program" ? input.resourceId : null,
    tipo: getItemType(input.resourceType),
    nombre_snapshot: input.title,
    cantidad: input.quantity,
    precio_unitario: input.unitPrice,
    descuento: 0,
    iva_porcentaje: 0,
    total,
  });

  if (itemError) throw itemError;

  return {
    id: order.id,
    number: order.numero_pedido,
    total,
    currency,
  };
}

export async function attachStripeSessionToOrder(input: {
  orderId: string;
  sessionId: string;
}) {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("pedidos")
    .update({
      stripe_session_id: input.sessionId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.orderId);

  if (error) throw error;
}

export async function fulfillPaidOrder(input: {
  orderId: string;
  stripeSessionId: string;
  paymentIntentId?: string | null;
  amountTotal?: number | null;
  currency?: string | null;
  profileId: string;
  resourceType: "program" | "course";
  resourceId: string;
}) {
  const supabase = createAdminSupabaseClient();
  const { data: existingOrder, error: existingOrderError } = await supabase
    .from("pedidos")
    .select("id,cliente_id,estado,stripe_session_id,stripe_payment_intent")
    .eq("id", input.orderId)
    .maybeSingle<ExistingOrderRow>();

  if (existingOrderError) throw existingOrderError;
  if (!existingOrder) {
    throw new Error("Order not found");
  }

  if (existingOrder.cliente_id !== input.profileId) {
    throw new Error("Order ownership mismatch");
  }

  if (
    existingOrder.stripe_session_id &&
    existingOrder.stripe_session_id !== input.stripeSessionId
  ) {
    throw new Error("Stripe session mismatch");
  }

  if (
    input.paymentIntentId &&
    existingOrder.stripe_payment_intent &&
    existingOrder.stripe_payment_intent !== input.paymentIntentId
  ) {
    throw new Error("Payment intent mismatch");
  }

  if (existingOrder.estado === "pagado") {
    return;
  }

  const { error: orderError } = await supabase
    .from("pedidos")
    .update({
      estado: "pagado",
      stripe_session_id: input.stripeSessionId,
      stripe_payment_intent: input.paymentIntentId ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.orderId);

  if (orderError) throw orderError;

  if (input.paymentIntentId) {
    const { error: paymentError } = await supabase.from("pagos").upsert(
      {
        pedido_id: input.orderId,
        tipo: "cobro",
        estado: "completado",
        importe: Number(
          ((input.amountTotal ?? 0) / 100).toFixed(2)
        ),
        moneda: (input.currency ?? "EUR").toUpperCase(),
        stripe_payment_intent_id: input.paymentIntentId,
        metodo_pago: "stripe_checkout",
        procesado_at: new Date().toISOString(),
      },
      { onConflict: "stripe_payment_intent_id" }
    );

    if (paymentError) throw paymentError;
  }

  if (input.resourceType === "course") {
    const { error: accessError } = await supabase.from("acceso_cursos").upsert(
      {
        alumno_id: input.profileId,
        curso_id: input.resourceId,
        pedido_id: input.orderId,
        tipo_acceso: "compra",
        activo: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "alumno_id,curso_id" }
    );

    if (accessError) throw accessError;
    return;
  }

  const { error: registrationError } = await supabase.from("inscripciones").upsert(
    {
      alumno_id: input.profileId,
      programa_id: input.resourceId,
      pedido_id: input.orderId,
      estado: "confirmada",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "alumno_id,programa_id" }
  );

  if (registrationError) throw registrationError;
}

export async function getOrderSummaryForUser(input: {
  profileId: string;
  stripeSessionId?: string | null;
  orderId?: string | null;
}) {
  const supabase = createAdminSupabaseClient();
  let query = supabase
    .from("pedidos")
    .select("id,numero_pedido,estado,total,moneda,stripe_session_id")
    .eq("cliente_id", input.profileId)
    .limit(1);

  if (input.stripeSessionId) {
    query = query.eq("stripe_session_id", input.stripeSessionId);
  } else if (input.orderId) {
    query = query.eq("id", input.orderId);
  } else {
    return null;
  }

  const { data, error } = await query.maybeSingle<{
    id: string;
    numero_pedido: string;
    estado: string;
    total: number;
    moneda: string;
    stripe_session_id: string | null;
  }>();

  if (error) throw error;

  return data;
}
