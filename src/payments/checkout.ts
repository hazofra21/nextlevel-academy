import "server-only";

import { getPaymentProviderStatus, type PaymentProvider } from "@/payments/providers";
import { getCheckoutResource } from "@/payments/catalog";
import { getStripeServerClient } from "@/payments/stripe";
import { attachStripeSessionToOrder, createPendingOrder } from "@/payments/orders";

export class CheckoutConfigurationError extends Error {
  constructor(message = "Payment provider not configured") {
    super(message);
    this.name = "CheckoutConfigurationError";
  }
}

export class CheckoutResourceError extends Error {
  constructor(message = "Checkout resource not available") {
    super(message);
    this.name = "CheckoutResourceError";
  }
}

export async function prepareCheckoutSession(input: {
  provider: PaymentProvider;
  resourceType: "program" | "course";
  resourceId: string;
  quantity: number;
  userId: string;
  email: string;
  origin: string;
}) {
  const provider = getPaymentProviderStatus(input.provider);

  if (!provider.enabled) {
    throw new CheckoutConfigurationError();
  }

  const resource = await getCheckoutResource({
    resourceType: input.resourceType,
    resourceId: input.resourceId,
  });

  if (!resource || !resource.published) {
    throw new CheckoutResourceError();
  }

  const order = await createPendingOrder({
    profileId: input.userId,
    email: input.email,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    title: resource.title,
    unitPrice: resource.price,
    quantity: input.quantity,
  });

  if (provider.provider === "stripe") {
    const stripe = getStripeServerClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${input.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${input.origin}/checkout/cancel?order_id=${order.id}`,
      customer_email: input.email,
      metadata: {
        orderId: order.id,
        profileId: input.userId,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        quantity: String(input.quantity),
      },
      line_items: [
        {
          quantity: input.quantity,
          price_data: {
            currency: order.currency.toLowerCase(),
            unit_amount: Math.round(resource.price * 100),
            product_data: {
              name: resource.title,
              metadata: {
                resourceType: input.resourceType,
                resourceId: input.resourceId,
              },
            },
          },
        },
      ],
    });

    await attachStripeSessionToOrder({
      orderId: order.id,
      sessionId: session.id,
    });

    return {
      provider: provider.provider,
      providerLabel: provider.label,
      resource,
      quantity: input.quantity,
      userId: input.userId,
      mode: provider.mode,
      checkoutUrl: session.url,
      orderId: order.id,
      orderNumber: order.number,
    };
  }

  return {
    provider: provider.provider,
    providerLabel: provider.label,
    resource,
    quantity: input.quantity,
    userId: input.userId,
    mode: provider.mode,
    checkoutUrl: null as string | null,
    orderId: order.id,
    orderNumber: order.number,
  };
}
