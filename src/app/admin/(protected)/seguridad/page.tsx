import AdminShell from "@/components/admin/AdminShell";
import { isTempAdminLoginEnabled } from "@/lib/admin-auth";
import { getPaymentProvidersStatus } from "@/payments/providers";
import { isDistributedRateLimitEnabled } from "@/security/rate-limit";
import { getRecentAuditLogs } from "@/security/audit";

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusClassName(status: "success" | "failure" | "info") {
  if (status === "success") {
    return "border-emerald-500/20 bg-emerald-500/8 text-emerald-300";
  }

  if (status === "failure") {
    return "border-[#ff4d4f]/20 bg-[#ff4d4f]/8 text-[#ffb8b9]";
  }

  return "border-[#00C8FF]/20 bg-[#00C8FF]/8 text-[#bfefff]";
}

export default async function AdminSeguridadPage() {
  const audit = await getRecentAuditLogs(40);
  const providers = getPaymentProvidersStatus();
  const tempAdminEnabled = isTempAdminLoginEnabled();
  const distributedRateLimitEnabled = isDistributedRateLimitEnabled();
  const stats = {
    total: audit.records.length,
    failures: audit.records.filter((item) => item.status === "failure").length,
    success: audit.records.filter((item) => item.status === "success").length,
    rateLimits: audit.records.filter((item) => item.event.includes("rate_limited")).length,
  };

  return (
    <AdminShell
      title="Seguridad"
      description="Visibilidad operativa de autenticación, errores sensibles, rate limiting y salud de pasarelas. Este módulo ya sirve para auditoría básica y endurecimiento progresivo del sistema."
    >
      <section className="grid gap-5 md:grid-cols-4">
        {[
          { label: "Eventos auditados", value: String(stats.total) },
          { label: "Éxitos", value: String(stats.success) },
          { label: "Fallos", value: String(stats.failures) },
          { label: "Rate limits", value: String(stats.rateLimits) },
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

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          {
            label: "Acceso admin",
            value: "Google + roles",
            tone: "text-emerald-300",
          },
          {
            label: "Rate limit distribuido",
            value: distributedRateLimitEnabled ? "Upstash" : "Fallback memoria",
            tone: distributedRateLimitEnabled ? "text-emerald-300" : "text-[#ffd38b]",
          },
          {
            label: "Fallback temporal",
            value: tempAdminEnabled ? "Expuesto" : "Retirado",
            tone: tempAdminEnabled ? "text-[#ffb8b9]" : "text-emerald-300",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[1.6rem] border border-[#191919] bg-[#0b0b0b]/92 p-6"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
              {item.label}
            </p>
            <p className={`mt-3 font-display text-3xl font-bold ${item.tone}`}>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <article className="rounded-[1.8rem] border border-[#191919] bg-[#0d0d0d]/92 p-7">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
            Estado
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold">Superficie expuesta</h2>

          <div className="mt-6 space-y-4">
            {providers.map((provider) => (
              <div
                key={provider.provider}
                className="rounded-2xl border border-[#1d1d1d] bg-white/4 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-2xl font-bold">{provider.label}</p>
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
                <p className="mt-3 text-sm text-[#8d8d8d]">
                  {provider.enabled
                    ? "Configuración detectada y lista para operar."
                    : `Faltan variables: ${provider.missing.join(" · ")}`}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-[#2a2a2a] bg-[#0c0c0c]/86 p-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#7d7d7d]">
              Próximo paso
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#9a9a9a]">
              {audit.available
                ? "La base de auditoría ya está operativa. El siguiente endurecimiento útil es activar Upstash para que el rate limit deje de depender del fallback en memoria."
                : "Ejecuta la migración 0003_audit_logs.sql en Supabase para persistir todos los eventos de auditoría y no depender solo de consola."}
            </p>
          </div>
        </article>

        <article className="rounded-[1.8rem] border border-[#191919] bg-[#0d0d0d]/92 p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
                Auditoría
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold">
                Últimos eventos
              </h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#cfcfcf]">
              {audit.available ? `${audit.records.length} visibles` : "tabla pendiente"}
            </span>
          </div>

          {!audit.available ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#2a2a2a] bg-[#0c0c0c]/86 p-5 text-sm text-[#7e7e7e]">
              La tabla de auditoría todavía no existe o no está accesible. El código ya está
              registrando en consola y quedará persistido en cuanto ejecutes la migración.
            </div>
          ) : null}

          <div className="mt-6 space-y-3">
            {audit.available && audit.records.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#2a2a2a] bg-[#0c0c0c]/86 p-5 text-sm text-[#7e7e7e]">
                Aún no hay eventos persistidos. En cuanto entren logins, leads, rate limits o
                webhooks aparecerán aquí.
              </div>
            ) : null}

            {audit.records.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#1d1d1d] bg-white/4 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-bold">{item.event}</p>
                    <p className="mt-2 text-sm text-[#8a8a8a]">
                      {item.route || "sin ruta"} · {item.ip || "ip no registrada"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em] ${getStatusClassName(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                    <p className="mt-2 text-xs text-[#6f6f6f]">
                      {formatDateTime(item.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminShell>
  );
}
