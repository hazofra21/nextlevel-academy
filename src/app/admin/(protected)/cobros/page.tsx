import AdminShell from "@/components/admin/AdminShell";
import { getBillingOverview } from "@/lib/billing";
import { getPaymentProvidersStatus } from "@/payments/providers";

function formatCurrency(value: number, currency = "EUR") {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "Sin fecha";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Sin fecha";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function AdminCobrosPage() {
  const overview = await getBillingOverview();
  const providers = getPaymentProvidersStatus();

  return (
    <AdminShell
      title="Cobros"
      description="Visión operativa de pedidos y pagos. Este módulo deja visible el pulso económico de la academia para luego conectar Stripe, reembolsos y conciliación real sin cambiar la interfaz."
    >
      <section className="grid gap-5 md:grid-cols-4">
        {[
          {
            label: "Facturación visible",
            value: formatCurrency(overview.stats.totalRevenue),
          },
          {
            label: "Pedidos recientes",
            value: overview.stats.totalOrders.toString(),
          },
          {
            label: "Pagos registrados",
            value: overview.stats.totalPayments.toString(),
          },
          {
            label: "Pendientes / reembolsos",
            value: `${overview.stats.pendingOrders} / ${overview.stats.refundedPayments}`,
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[1.6rem] border border-[#191919] bg-[#0b0b0b]/92 p-6"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
              {item.label}
            </p>
            <p className="mt-3 font-display text-4xl font-bold">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <article className="rounded-[1.8rem] border border-[#191919] bg-[#0d0d0d]/92 p-7 xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
                Pasarelas
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold">
                Stripe + PayPal
              </h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#cfcfcf]">
              arquitectura multi-provider
            </span>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {providers.map((provider) => (
              <div
                key={provider.provider}
                className="rounded-2xl border border-[#1d1d1d] bg-white/4 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-3xl font-bold">{provider.label}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[#8a8a8a]">
                      {provider.primary ? "pasarela principal" : "pasarela secundaria"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em] ${
                      provider.enabled
                        ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-300"
                        : "border-[#ff4d4f]/20 bg-[#ff4d4f]/8 text-[#ffb8b9]"
                    }`}
                  >
                    {provider.enabled ? provider.mode : "pendiente"}
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  {provider.capabilities.map((item) => (
                    <p key={item} className="text-sm text-[#cfcfcf]">
                      {item}
                    </p>
                  ))}
                </div>

                {!provider.enabled ? (
                  <div className="mt-5 rounded-2xl border border-dashed border-[#2b2b2b] bg-[#0b0b0b]/80 p-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#7d7d7d]">
                      envs pendientes
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#9a9a9a]">
                      {provider.missing.join(" · ")}
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.8rem] border border-[#191919] bg-[#0d0d0d]/92 p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
                Pedidos
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold">
                Últimos pedidos
              </h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#cfcfcf]">
              {overview.orders.length} visibles
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {overview.orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#2a2a2a] bg-[#0c0c0c]/86 p-5 text-sm text-[#7e7e7e]">
                Todavía no hay pedidos registrados en la base de datos.
              </div>
            ) : null}

            {overview.orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-[#1d1d1d] bg-white/4 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-bold">
                      {order.numero_pedido}
                    </p>
                    <p className="mt-2 text-sm text-[#8a8a8a]">
                      {order.profileName} · {order.envio_email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-[#00C8FF]">
                      {formatCurrency(Number(order.total || 0), order.moneda)}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#8a8a8a]">
                      {order.estado}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-[#6f6f6f]">
                  Creado el {formatDate(order.created_at)}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.8rem] border border-[#191919] bg-[#0d0d0d]/92 p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
                Pagos
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold">
                Movimientos
              </h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#cfcfcf]">
              {overview.payments.length} visibles
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {overview.payments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#2a2a2a] bg-[#0c0c0c]/86 p-5 text-sm text-[#7e7e7e]">
                Todavía no hay pagos. Cuando entre Stripe quedará reflejado aquí.
              </div>
            ) : null}

            {overview.payments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-2xl border border-[#1d1d1d] bg-white/4 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-bold">
                      {payment.tipo}
                    </p>
                    <p className="mt-2 text-sm text-[#8a8a8a]">
                      Pedido {payment.pedido_id.slice(0, 8)} ·{" "}
                      {payment.metodo_pago || "Método pendiente"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-[#00C8FF]">
                      {formatCurrency(Number(payment.importe || 0), payment.moneda)}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#8a8a8a]">
                      {payment.estado}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-[#6f6f6f]">
                  {payment.marca_tarjeta && payment.ultimos4
                    ? `${payment.marca_tarjeta.toUpperCase()} · **** ${payment.ultimos4}`
                    : payment.es_manual
                      ? "Registro manual"
                      : "Sin datos de tarjeta"}{" "}
                  · {formatDate(payment.procesado_at ?? payment.created_at)}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminShell>
  );
}
