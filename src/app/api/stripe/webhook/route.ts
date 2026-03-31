import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { auditLog } from "@/security/audit";
import { fulfillPaidOrder } from "@/payments/orders";
import { getStripeServerClient, getStripeWebhookSecret } from "@/payments/stripe";

export const runtime = "nodejs";

function getSessionMetadata(session: Stripe.Checkout.Session) {
  const metadata = session.metadata ?? {};
  const orderId = metadata.orderId;
  const profileId = metadata.profileId;
  const resourceType = metadata.resourceType;
  const resourceId = metadata.resourceId;

  if (
    !orderId ||
    !profileId ||
    !resourceId ||
    (resourceType !== "program" && resourceType !== "course")
  ) {
    throw new Error("Invalid checkout metadata");
  }

  return {
    orderId,
    profileId,
    resourceType,
    resourceId,
  } as const;
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripeServerClient();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      getStripeWebhookSecret()
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode !== "payment" || session.payment_status !== "paid") {
        auditLog({
          event: "stripe_checkout_not_paid",
          status: "info",
          route: "/api/stripe/webhook",
          metadata: {
            sessionId: session.id,
            eventType: event.type,
            paymentStatus: session.payment_status,
            mode: session.mode,
          },
        });

        return NextResponse.json({ received: true });
      }

      const metadata = getSessionMetadata(session);

      await fulfillPaidOrder({
        orderId: metadata.orderId,
        stripeSessionId: session.id,
        paymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : null,
        amountTotal: session.amount_total ?? null,
        currency: session.currency ?? "eur",
        profileId: metadata.profileId,
        resourceType: metadata.resourceType,
        resourceId: metadata.resourceId,
      });

      auditLog({
        event: "stripe_checkout_completed",
        status: "success",
        actorId: metadata.profileId,
        route: "/api/stripe/webhook",
        metadata: {
          orderId: metadata.orderId,
          sessionId: session.id,
        },
      });
    }

    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session;

      auditLog({
        event: "stripe_checkout_async_failed",
        status: "failure",
        route: "/api/stripe/webhook",
        metadata: {
          sessionId: session.id,
          paymentStatus: session.payment_status,
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    auditLog({
      event: "stripe_webhook_failed",
      status: "failure",
      route: "/api/stripe/webhook",
      metadata: {
        reason: error instanceof Error ? error.message : "unknown",
        eventType: event.type,
      },
    });

    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
