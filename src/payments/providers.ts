import "server-only";

export type PaymentProvider = "stripe" | "paypal";

export interface PaymentProviderStatus {
  provider: PaymentProvider;
  label: string;
  enabled: boolean;
  mode: "live" | "sandbox" | "missing";
  primary: boolean;
  capabilities: string[];
  missing: string[];
}

function hasEnv(name: string) {
  const value = process.env[name]?.trim();
  return Boolean(value);
}

export function getPaymentProvidersStatus(): PaymentProviderStatus[] {
  const stripeSecret = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  const stripeConfigured =
    hasEnv("STRIPE_SECRET_KEY") &&
    hasEnv("STRIPE_WEBHOOK_SECRET") &&
    hasEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");

  const paypalConfigured =
    hasEnv("PAYPAL_CLIENT_ID") &&
    hasEnv("PAYPAL_CLIENT_SECRET") &&
    hasEnv("PAYPAL_WEBHOOK_ID");

  return [
    {
      provider: "stripe",
      label: "Stripe",
      enabled: stripeConfigured,
      mode: stripeConfigured
        ? stripeSecret.startsWith("sk_live_")
          ? "live"
          : "sandbox"
        : "missing",
      primary: true,
      capabilities: [
        "Checkout principal",
        "Webhook firmado",
        "Pagos con tarjeta",
        "Reembolsos y conciliación",
      ],
      missing: stripeConfigured
        ? []
        : [
            "STRIPE_SECRET_KEY",
            "STRIPE_WEBHOOK_SECRET",
            "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
          ],
    },
    {
      provider: "paypal",
      label: "PayPal",
      enabled: paypalConfigured,
      mode: paypalConfigured
        ? process.env.PAYPAL_ENV?.trim() === "live"
          ? "live"
          : "sandbox"
        : "missing",
      primary: false,
      capabilities: [
        "Pasarela secundaria",
        "Checkout alternativo",
        "Fallback comercial",
      ],
      missing: paypalConfigured
        ? []
        : ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET", "PAYPAL_WEBHOOK_ID"],
    },
  ];
}

export function getPaymentProviderStatus(provider: PaymentProvider) {
  return getPaymentProvidersStatus().find((item) => item.provider === provider)!;
}
