"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

interface CheckoutButtonProps {
  resourceType: "program" | "course";
  resourceId: string;
  enabled: boolean;
  label?: string;
  quantity?: number;
  variant?: "primary" | "outline";
  fullWidth?: boolean;
}

function getButtonClassName(
  variant: CheckoutButtonProps["variant"],
  fullWidth: boolean,
  pending: boolean
) {
  const width = fullWidth ? " w-full justify-center" : "";
  const state = pending ? " opacity-70" : "";

  if (variant === "outline") {
    return `btn-outline rounded px-6 py-3 text-sm inline-flex items-center gap-2${width}${state}`;
  }

  return `btn-primary rounded px-6 py-3 text-sm inline-flex items-center gap-2${width}${state}`;
}

function mapCheckoutError(status: number) {
  if (status === 401) return null;
  if (status === 404) return "Este evento ya no está disponible.";
  if (status === 429) return "Demasiados intentos. Espera un momento.";
  if (status === 503) return "La pasarela de pago no está disponible ahora mismo.";

  return "No se ha podido preparar la reserva.";
}

export default function CheckoutButton({
  resourceType,
  resourceId,
  enabled,
  label = "Reservar plaza",
  quantity = 1,
  variant = "primary",
  fullWidth = false,
}: CheckoutButtonProps) {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!enabled) {
    return null;
  }

  const loginUrl = `/login?next=${encodeURIComponent(pathname || "/dashboard")}`;

  async function handleCheckout() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          provider: "stripe",
          resourceType,
          resourceId,
          quantity,
        }),
      });

      if (response.status === 401) {
        window.location.href = loginUrl;
        return;
      }

      const payload = (await response.json().catch(() => null)) as
        | { checkoutUrl?: string | null }
        | null;

      if (!response.ok) {
        setError(mapCheckoutError(response.status));
        return;
      }

      if (payload?.checkoutUrl) {
        window.location.href = payload.checkoutUrl;
        return;
      }

      setError("No se ha podido abrir el checkout.");
    } catch {
      setError("Ha fallado la conexión con el checkout.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={fullWidth ? "w-full" : ""}>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={pending}
        className={getButtonClassName(variant, fullWidth, pending)}
      >
        {pending ? "Preparando pago..." : label}
      </button>
      {error ? <p className="mt-2 text-xs text-[#ff9f9f]">{error}</p> : null}
    </div>
  );
}
