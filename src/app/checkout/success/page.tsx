import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCurrentUserContext } from "@/auth/user";
import { getOrderSummaryForUser } from "@/payments/orders";

interface CheckoutSuccessPageProps {
  searchParams?: Promise<{
    session_id?: string;
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = (await searchParams) ?? {};
  const context = await getCurrentUserContext();
  const order =
    context && params.session_id
      ? await getOrderSummaryForUser({
          profileId: context.profile.id,
          stripeSessionId: params.session_id,
        })
      : null;
  const isPaid = order?.estado === "pagado";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] pt-28">
        <section className="bg-[#050505]/78 pb-24 backdrop-blur-[2px]">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-[2rem] border border-[#191919] bg-[#0d0d0d]/92 p-10 text-center">
              <div className="accent-line mx-auto mb-4" />
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#00C8FF]">
                {isPaid ? "Pago confirmado" : "Pago en revisión"}
              </span>
              <h1 className="mt-4 font-display text-5xl font-bold md:text-6xl">
                {isPaid ? "CHECKOUT COMPLETADO" : "PAGO RECIBIDO"}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#8a8a8a]">
                {isPaid
                  ? "El pedido ya figura como pagado en el sistema y el acceso correspondiente ha quedado activado."
                  : "Hemos recibido la vuelta desde Stripe, pero el pedido todavía se está conciliando en servidor. Si acabas de pagar, recarga en unos segundos o revisa tu dashboard."}
              </p>
              {order ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#7d7d7d]">
                    Pedido
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold">
                    {order.numero_pedido}
                  </p>
                  <p className="mt-2 text-sm text-[#8a8a8a]">
                    Estado: {order.estado} · Total: {order.total} {order.moneda}
                  </p>
                </div>
              ) : context && params.session_id ? (
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[#5f5f5f]">
                  No hemos encontrado un pedido asociado a esta sesión.
                </p>
              ) : null}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/dashboard" className="btn-primary rounded px-8 py-4 text-sm">
                  Ir al dashboard
                </Link>
                <Link href="/campamentos" className="btn-outline rounded px-8 py-4 text-sm">
                  Volver a programas
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
