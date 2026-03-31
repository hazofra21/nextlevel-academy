import { NextResponse, type NextRequest } from "next/server";
import { getClientIp } from "@/security/ip";
import { isTrustedOrigin } from "@/security/request-origin";
import { consumeRateLimit } from "@/security/rate-limit";
import { auditLog } from "@/security/audit";
import { checkoutSessionSchema } from "@/security/validation/checkout";
import { getCurrentUserContext } from "@/auth/user";
import {
  CheckoutConfigurationError,
  CheckoutResourceError,
  prepareCheckoutSession,
} from "@/payments/checkout";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);

  if (!isTrustedOrigin(request.headers)) {
    auditLog({
      event: "checkout_origin_rejected",
      status: "failure",
      ip,
      route: "/api/checkout/session",
    });

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rateLimit = await consumeRateLimit({
    key: `checkout:${ip}`,
    windowMs: 5 * 60 * 1000,
    max: 20,
  });

  if (!rateLimit.ok) {
    auditLog({
      event: "checkout_rate_limited",
      status: "failure",
      ip,
      route: "/api/checkout/session",
    });

    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  const context = await getCurrentUserContext();

  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = checkoutSessionSchema.safeParse(body);

  if (!parsed.success) {
    auditLog({
      event: "checkout_invalid_payload",
      status: "failure",
      actorId: context.user.id,
      ip,
      route: "/api/checkout/session",
    });

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const session = await prepareCheckoutSession({
      ...parsed.data,
      userId: context.user.id,
      email: context.profile.email,
      origin: request.nextUrl.origin,
    });

    auditLog({
      event: "checkout_session_prepared",
      status: "info",
      actorId: context.user.id,
      ip,
      route: "/api/checkout/session",
      metadata: {
        provider: session.provider,
        resourceType: parsed.data.resourceType,
        resourceId: parsed.data.resourceId,
      },
    });

    if (session.provider === "stripe") {
      return NextResponse.json(
        {
          ok: true,
          provider: session.provider,
          providerLabel: session.providerLabel,
          mode: session.mode,
          checkoutUrl: session.checkoutUrl,
          orderId: session.orderId,
          orderNumber: session.orderNumber,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        error: "Provider not implemented yet",
      },
      { status: 501 }
    );
  } catch (error) {
    auditLog({
      event: "checkout_session_failed",
      status: "failure",
      actorId: context.user.id,
      ip,
      route: "/api/checkout/session",
      metadata: {
        reason: error instanceof Error ? error.name : "unknown",
      },
    });

    if (error instanceof CheckoutConfigurationError) {
      return NextResponse.json(
        { error: "Payment provider unavailable" },
        { status: 503 }
      );
    }

    if (error instanceof CheckoutResourceError) {
      return NextResponse.json({ error: "Resource unavailable" }, { status: 404 });
    }

    return NextResponse.json({ error: "Unable to create checkout" }, { status: 500 });
  }
}
