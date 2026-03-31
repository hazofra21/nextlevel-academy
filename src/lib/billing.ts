import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface AdminOrderRecord {
  id: string;
  numero_pedido: string;
  cliente_id: string;
  estado: string;
  total: number;
  moneda: string;
  envio_email: string;
  created_at: string;
  profileName: string;
}

export interface AdminPaymentRecord {
  id: string;
  pedido_id: string;
  tipo: string;
  estado: string;
  importe: number;
  moneda: string;
  metodo_pago: string | null;
  marca_tarjeta: string | null;
  ultimos4: string | null;
  es_manual: boolean;
  created_at: string;
  procesado_at: string | null;
}

interface OrderRow {
  id: string;
  numero_pedido: string;
  cliente_id: string;
  estado: string;
  total: number;
  moneda: string;
  envio_email: string;
  created_at: string;
}

interface PaymentRow {
  id: string;
  pedido_id: string;
  tipo: string;
  estado: string;
  importe: number;
  moneda: string;
  metodo_pago: string | null;
  marca_tarjeta: string | null;
  ultimos4: string | null;
  es_manual: boolean;
  created_at: string;
  procesado_at: string | null;
}

interface ProfileRow {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
}

function formatProfileName(profile?: ProfileRow) {
  if (!profile) return "Cliente sin perfil";

  const fullName = `${profile.nombre ?? ""} ${profile.apellidos ?? ""}`.trim();

  return fullName || profile.email || "Cliente sin nombre";
}

export async function getBillingOverview() {
  const supabase = createAdminSupabaseClient();
  const [{ data: orders, error: ordersError }, { data: payments, error: paymentsError }] =
    await Promise.all([
      supabase
        .from("pedidos")
        .select(
          "id,numero_pedido,cliente_id,estado,total,moneda,envio_email,created_at"
        )
        .order("created_at", { ascending: false })
        .limit(24),
      supabase
        .from("pagos")
        .select(
          "id,pedido_id,tipo,estado,importe,moneda,metodo_pago,marca_tarjeta,ultimos4,es_manual,created_at,procesado_at"
        )
        .order("created_at", { ascending: false })
        .limit(24),
    ]);

  if (ordersError) throw ordersError;
  if (paymentsError) throw paymentsError;

  const clientIds = Array.from(
    new Set((orders ?? []).map((order) => order.cliente_id).filter(Boolean))
  );

  let profilesById = new Map<string, ProfileRow>();

  if (clientIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id,nombre,apellidos,email")
      .in("id", clientIds);

    if (profilesError) throw profilesError;

    profilesById = new Map(
      (profiles ?? []).map((profile) => [profile.id, profile as ProfileRow])
    );
  }

  const mappedOrders: AdminOrderRecord[] = ((orders ?? []) as OrderRow[]).map(
    (order) => ({
      ...order,
      profileName: formatProfileName(profilesById.get(order.cliente_id)),
    })
  );

  const mappedPayments = ((payments ?? []) as PaymentRow[]).map((payment) => ({
    ...payment,
  }));

  const totalRevenue = mappedPayments
    .filter((payment) => payment.estado === "completado" && payment.tipo === "cobro")
    .reduce((sum, payment) => sum + Number(payment.importe || 0), 0);

  const pendingOrders = mappedOrders.filter(
    (order) => order.estado === "pendiente" || order.estado === "en_proceso"
  ).length;

  const refundedPayments = mappedPayments.filter((payment) =>
    payment.tipo.startsWith("reembolso")
  ).length;

  return {
    orders: mappedOrders,
    payments: mappedPayments,
    stats: {
      totalRevenue,
      totalOrders: mappedOrders.length,
      totalPayments: mappedPayments.length,
      pendingOrders,
      refundedPayments,
    },
  };
}
